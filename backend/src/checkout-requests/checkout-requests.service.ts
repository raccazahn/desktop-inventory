import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { CheckoutRequest } from '../entities/checkout-request.entity';
import { Equipment } from '../entities/equipment.entity';
import { CreateCheckoutRequestDto, UpdateCheckoutRequestDto } from './dto/create-checkout-request.dto';

@Injectable()
export class CheckoutRequestsService {
  constructor(
    @InjectRepository(CheckoutRequest)
    private readonly requestRepository: Repository<CheckoutRequest>,
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
  ) {}

  async create(userId: number, createDto: CreateCheckoutRequestDto): Promise<CheckoutRequest> {
    // Validate equipment exists
    const equipment = await this.equipmentRepository.findOne({ 
      where: { id: createDto.equipmentId } 
    });
    
    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }
    
    if (equipment.status !== 'Available') {
      throw new BadRequestException('Equipment is not available');
    }

    // Convert dueDate string to Date object
    const dueDateObj = new Date(createDto.dueDate);
    if (isNaN(dueDateObj.getTime())) {
      throw new BadRequestException('Invalid dueDate format');
    }

    // Create request
    const request = this.requestRepository.create({
      equipmentId: createDto.equipmentId,
      studentId: userId,
      borrowerName: createDto.borrowerName,
      borrowerEmail: createDto.borrowerEmail,
      dueDate: dueDateObj,
      purpose: createDto.purpose,
      status: 'pending'
    });

    return await this.requestRepository.save(request);
  }

  async findByStudent(studentId: number): Promise<CheckoutRequest[]> {
    return await this.requestRepository.find({
      where: { studentId },
      relations: ['equipment'],
      order: { createdAt: 'DESC' }
    });
  }

  async findAll(status?: string): Promise<CheckoutRequest[]> {
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    
    return await this.requestRepository.find({
      where,
      relations: ['equipment', 'student'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<CheckoutRequest> {
    const request = await this.requestRepository.findOne({ 
      where: { id },
      relations: ['equipment', 'student']
    });
    
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    
    return request;
  }

  async updateStatus(id: number, updateDto: UpdateCheckoutRequestDto): Promise<CheckoutRequest> {
    const request = await this.findOne(id);
    
    if (updateDto.status) {
      const oldStatus = request.status;
      request.status = updateDto.status;
      
      // Handle status transitions
      if (updateDto.status === 'approved' && oldStatus === 'pending') {
        request.approvedAt = new Date();
        if (request.equipment) {
          request.equipment.status = 'Reserved';
          await this.equipmentRepository.save(request.equipment);
        }
      }
      
      if (updateDto.status === 'picked_up' && oldStatus === 'approved') {
        request.pickedUpAt = new Date();
        if (request.equipment) {
          request.equipment.status = 'In Use';
          await this.equipmentRepository.save(request.equipment);
        }
      }
      
      if (updateDto.status === 'returned') {
        request.returnedAt = new Date();
        if (request.equipment) {
          request.equipment.status = 'Available';
          await this.equipmentRepository.save(request.equipment);
        }
      }
      
      if (updateDto.status === 'rejected') {
        // Equipment stays Available
      }
    }
    
    if (updateDto.adminNotes) {
      request.adminNotes = updateDto.adminNotes;
    }
    
    return await this.requestRepository.save(request);
  }

  async remove(id: number): Promise<any> {
    const request = await this.findOne(id);
    
    if (request.equipment && request.equipment.status === 'Reserved') {
      request.equipment.status = 'Available';
      await this.equipmentRepository.save(request.equipment);
    }
    
    await this.requestRepository.remove(request);
    
    return { message: 'Request deleted' };
  }

  async sendReminder(id: number): Promise<any> {
    const request = await this.findOne(id);
    
    if (request.status !== 'approved' && request.status !== 'picked_up') {
      throw new BadRequestException('Can only send reminders for approved requests');
    }
    
    console.log('Reminder sent to:', request.borrowerEmail);
    
    return { message: 'Reminder sent' };
  }

  async findOverdueRequests(): Promise<CheckoutRequest[]> {
    const today = new Date();
    
    return await this.requestRepository.find({
      where: {
        status: 'approved',
        dueDate: LessThan(today)
      },
      relations: ['equipment', 'student']
    });
  }
}