import { Repository } from 'typeorm';
import { Equipment } from '../entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
export declare class EquipmentService {
    private readonly equipmentRepository;
    constructor(equipmentRepository: Repository<Equipment>);
    create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment>;
    findAll(status?: string): Promise<Equipment[]>;
    findOne(id: number): Promise<Equipment>;
    update(id: number, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
