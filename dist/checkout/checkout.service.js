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
exports.CheckoutService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const checkout_entity_1 = require("../entities/checkout.entity");
const equipment_entity_1 = require("../entities/equipment.entity");
let CheckoutService = class CheckoutService {
    constructor(checkoutRepository, equipmentRepository) {
        this.checkoutRepository = checkoutRepository;
        this.equipmentRepository = equipmentRepository;
    }
    async findAll(status) {
        const where = {};
        if (status && status !== 'all') {
            where.status = status;
        }
        return await this.checkoutRepository.find({
            where,
            relations: ['equipment'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const checkout = await this.checkoutRepository.findOne({
            where: { id },
            relations: ['equipment']
        });
        if (!checkout) {
            throw new common_1.NotFoundException('Checkout not found');
        }
        return checkout;
    }
    async create(createCheckoutDto) {
        const equipment = await this.equipmentRepository.findOne({
            where: { id: createCheckoutDto.equipmentId }
        });
        if (!equipment) {
            throw new common_1.NotFoundException('Equipment not found');
        }
        if (equipment.status !== 'Available') {
            throw new common_1.BadRequestException('Equipment is not available');
        }
        const dueDateObj = new Date(createCheckoutDto.dueDate);
        if (isNaN(dueDateObj.getTime())) {
            throw new common_1.BadRequestException('Invalid dueDate format');
        }
        const checkout = this.checkoutRepository.create({
            equipmentId: createCheckoutDto.equipmentId,
            userId: createCheckoutDto.userId,
            borrowerName: createCheckoutDto.borrowerName,
            borrowerEmail: createCheckoutDto.borrowerEmail,
            dueDate: dueDateObj,
            purpose: createCheckoutDto.purpose,
            status: createCheckoutDto.status || 'borrowed'
        });
        equipment.status = 'In Use';
        await this.equipmentRepository.save(equipment);
        return await this.checkoutRepository.save(checkout);
    }
    async markAsReturned(id) {
        const checkout = await this.checkoutRepository.findOne({
            where: { id },
            relations: ['equipment']
        });
        if (!checkout) {
            throw new common_1.NotFoundException('Checkout not found');
        }
        if (checkout.status === 'returned') {
            throw new common_1.BadRequestException('Already returned');
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
    async remove(id) {
        const checkout = await this.findOne(id);
        if (checkout.equipment && checkout.equipment.status === 'In Use') {
            checkout.equipment.status = 'Available';
            await this.equipmentRepository.save(checkout.equipment);
        }
        await this.checkoutRepository.remove(checkout);
        return { message: 'Checkout deleted' };
    }
    async findOverdue() {
        const today = new Date();
        return await this.checkoutRepository.find({
            where: {
                status: 'borrowed',
                dueDate: (0, typeorm_2.LessThan)(today)
            },
            relations: ['equipment']
        });
    }
};
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(checkout_entity_1.Checkout)),
    __param(1, (0, typeorm_1.InjectRepository)(equipment_entity_1.Equipment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CheckoutService);
//# sourceMappingURL=checkout.service.js.map