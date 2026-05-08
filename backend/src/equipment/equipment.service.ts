import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from '../entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    const equipment = this.equipmentRepository.create(createEquipmentDto);
    return await this.equipmentRepository.save(equipment);
  }

  async findAll(status?: string): Promise<Equipment[]> {
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    return await this.equipmentRepository.find({ where });
  }

  async findOne(id: number): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({ where: { id } });
    if (!equipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }
    return equipment;
  }

  async update(id: number, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment> {
    const equipment = await this.findOne(id);
    Object.assign(equipment, updateEquipmentDto);
    return await this.equipmentRepository.save(equipment);
  }

  // ✅ FIXED: Delete equipment with foreign key handling
  async remove(id: number): Promise<{ message: string }> {
    const equipment = await this.findOne(id);
    
    // ✅ Check if equipment has associated checkouts
    // We need to import Checkout entity or use query builder
    const checkoutCount = await this.equipmentRepository
      .createQueryBuilder('equipment')
      .leftJoin('checkout', 'checkout', 'checkout.equipmentId = equipment.id')
      .where('equipment.id = :id', { id })
      .getCount();
    
    // ✅ Option 1: Prevent deletion if checkouts exist (safer)
    if (checkoutCount > 0) {
      throw new BadRequestException(
        `Cannot delete equipment: ${checkoutCount} checkout record(s) reference this item. 
         Please delete associated checkouts first or mark equipment as unavailable.`
      );
    }
    
    // ✅ Option 2: Delete associated checkouts first (if you prefer)
    // Uncomment the lines below if you want to auto-delete checkouts:
    /*
    const queryRunner = this.equipmentRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query('DELETE FROM checkout WHERE equipmentId = ?', [id]);
      await queryRunner.manager.remove(equipment);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
    */
    
    // ✅ Simple delete (works if no foreign key references)
    await this.equipmentRepository.remove(equipment);
    
    return { message: 'Equipment deleted successfully' };
  }
}