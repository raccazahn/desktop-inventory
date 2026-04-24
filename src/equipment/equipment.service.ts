import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from '../entities/equipment.entity';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/create-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
  ) {}

  async findAll(status?: string): Promise<Equipment[]> {
    if (status) {
      return await this.equipmentRepository.find({ where: { status } });
    }
    return await this.equipmentRepository.find();
  }

  async findOne(id: number): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({ where: { id } });
    if (!equipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }
    return equipment;
  }

  async create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const equipment = this.equipmentRepository.create(createEquipmentDto);
    return await this.equipmentRepository.save(equipment);
  }

  async update(id: number, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment> {
    const equipment = await this.findOne(id);
    Object.assign(equipment, updateEquipmentDto);
    return await this.equipmentRepository.save(equipment);
  }

  async remove(id: number): Promise<{ message: string }> {
    const equipment = await this.findOne(id);
    await this.equipmentRepository.remove(equipment);
    return { message: 'Equipment deleted successfully' };
  }
}