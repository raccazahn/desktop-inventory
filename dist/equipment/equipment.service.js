"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const equipment_entity_1 = require("../entities/equipment.entity");
let EquipmentService = class EquipmentService {
    constructor(equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }
    async findAll(status) {
        if (status) {
            return await this.equipmentRepository.find({ where: { status } });
        }
        return await this.equipmentRepository.find();
    }
    async findOne(id) {
        const equipment = await this.equipmentRepository.findOne({ where: { id } });
        if (!equipment) {
            throw new common_1.NotFoundException(`Equipment with ID ${id} not found`);
        }
        return equipment;
    }
    async create(createEquipmentDto) {
        const equipment = this.equipmentRepository.create(createEquipmentDto);
        return await this.equipmentRepository.save(equipment);
    }
    async update(id, updateEquipmentDto) {
        const equipment = await this.findOne(id);
        Object.assign(equipment, updateEquipmentDto);
        return await this.equipmentRepository.save(equipment);
    }
    async remove(id) {
        const equipment = await this.findOne(id);
        await this.equipmentRepository.remove(equipment);
        return { message: 'Equipment deleted successfully' };
    }
};
exports.EquipmentService = EquipmentService;
exports.EquipmentService = EquipmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(equipment_entity_1.Equipment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EquipmentService);
//# sourceMappingURL=equipment.service.js.map