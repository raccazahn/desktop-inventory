import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Checkout } from '../entities/checkout.entity';
import { Equipment } from '../entities/equipment.entity';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Checkout)
    private readonly checkoutRepository: Repository<Checkout>,
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
  ) {}

  async findAll(status?: string): Promise<Checkout[]> {
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    
    return await this.checkoutRepository.find({
      where,
      relations: ['equipment'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Checkout> {
    const checkout = await this.checkoutRepository.findOne({ 
      where: { id },
      relations: ['equipment']
    });
    
    if (!checkout) {
      throw new NotFoundException('Checkout not found');
    }
    
    return checkout;
  }

  async create(createCheckoutDto: CreateCheckoutDto): Promise<Checkout> {
    // Validate equipment exists
    const equipment = await this.equipmentRepository.findOne({ 
      where: { id: createCheckoutDto.equipmentId } 
    });
    
    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }
    
    if (equipment.status !== 'Available') {
      throw new BadRequestException('Equipment is not available');
    }

    // Convert dueDate string to Date object
    const dueDateObj = new Date(createCheckoutDto.dueDate);
    if (isNaN(dueDateObj.getTime())) {
      throw new BadRequestException('Invalid dueDate format');
    }

    // Create checkout
    const checkout = this.checkoutRepository.create({
      equipmentId: createCheckoutDto.equipmentId,
      userId: createCheckoutDto.userId,
      borrowerName: createCheckoutDto.borrowerName,
      borrowerEmail: createCheckoutDto.borrowerEmail,
      dueDate: dueDateObj,
      purpose: createCheckoutDto.purpose,
      status: createCheckoutDto.status || 'borrowed'
    });

    // Update equipment status
    equipment.status = 'In Use';
    await this.equipmentRepository.save(equipment);

    return await this.checkoutRepository.save(checkout);
  }

  async markAsReturned(id: number): Promise<any> {
    const checkout = await this.checkoutRepository.findOne({ 
      where: { id },
      relations: ['equipment']
    });
    
    if (!checkout) {
      throw new NotFoundException('Checkout not found');
    }
    
    if (checkout.status === 'returned') {
      throw new BadRequestException('Already returned');
    }

    checkout.status = 'returned';
    checkout.returnDate = new Date();
    
    if (checkout.equipment) {
      checkout.equipment.status = 'Available';
      await this.equipmentRepository.save(checkout.equipment);
    }
    
    await this.checkoutRepository.save(checkout);
    
    return { message: 'Equipment returned successfully' };
  }

  async remove(id: number): Promise<any> {
    const checkout = await this.findOne(id);
    
    if (checkout.equipment && checkout.equipment.status === 'In Use') {
      checkout.equipment.status = 'Available';
      await this.equipmentRepository.save(checkout.equipment);
    }
    
    await this.checkoutRepository.remove(checkout);
    
    return { message: 'Checkout deleted' };
  }

  async findOverdue(): Promise<Checkout[]> {
    const today = new Date();
    
    return await this.checkoutRepository.find({
      where: {
        status: 'borrowed',
        dueDate: LessThan(today)
      },
      relations: ['equipment']
    });
  }
}