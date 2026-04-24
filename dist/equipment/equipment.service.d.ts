import { Repository } from 'typeorm';
import { Equipment } from '../entities/equipment.entity';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/create-equipment.dto';
export declare class EquipmentService {
    private readonly equipmentRepository;
    constructor(equipmentRepository: Repository<Equipment>);
    findAll(status?: string): Promise<Equipment[]>;
    findOne(id: number): Promise<Equipment>;
    create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment>;
    update(id: number, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
