import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from './dto/create-equipment.dto';
export declare class EquipmentController {
    private readonly equipmentService;
    constructor(equipmentService: EquipmentService);
    findAll(status?: string): Promise<import("../entities/equipment.entity").Equipment[]>;
    findOne(id: string): Promise<import("../entities/equipment.entity").Equipment>;
    create(createEquipmentDto: CreateEquipmentDto): Promise<import("../entities/equipment.entity").Equipment>;
    update(id: string, updateEquipmentDto: UpdateEquipmentDto): Promise<import("../entities/equipment.entity").Equipment>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
