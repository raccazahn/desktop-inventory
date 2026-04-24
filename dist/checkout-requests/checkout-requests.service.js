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
exports.CheckoutRequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const checkout_request_entity_1 = require("../entities/checkout-request.entity");
const equipment_entity_1 = require("../entities/equipment.entity");
let CheckoutRequestsService = class CheckoutRequestsService {
    constructor(requestRepository, equipmentRepository) {
        this.requestRepository = requestRepository;
        this.equipmentRepository = equipmentRepository;
    }
    async create(userId, createDto) {
        const equipment = await this.equipmentRepository.findOne({
            where: { id: createDto.equipmentId }
        });
        if (!equipment) {
            throw new common_1.NotFoundException('Equipment not found');
        }
        if (equipment.status !== 'Available') {
            throw new common_1.BadRequestException('Equipment is not available');
        }
        const dueDateObj = new Date(createDto.dueDate);
        if (isNaN(dueDateObj.getTime())) {
            throw new common_1.BadRequestException('Invalid dueDate format');
        }
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
    async findByStudent(studentId) {
        return await this.requestRepository.find({
            where: { studentId },
            relations: ['equipment'],
            order: { createdAt: 'DESC' }
        });
    }
    async findAll(status) {
        const where = {};
        if (status && status !== 'all') {
            where.status = status;
        }
        return await this.requestRepository.find({
            where,
            relations: ['equipment', 'student'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const request = await this.requestRepository.findOne({
            where: { id },
            relations: ['equipment', 'student']
        });
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        return request;
    }
    async updateStatus(id, updateDto) {
        const request = await this.findOne(id);
        if (updateDto.status) {
            const oldStatus = request.status;
            request.status = updateDto.status;
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
            }
        }
        if (updateDto.adminNotes) {
            request.adminNotes = updateDto.adminNotes;
        }
        return await this.requestRepository.save(request);
    }
    async remove(id) {
        const request = await this.findOne(id);
        if (request.equipment && request.equipment.status === 'Reserved') {
            request.equipment.status = 'Available';
            await this.equipmentRepository.save(request.equipment);
        }
        await this.requestRepository.remove(request);
        return { message: 'Request deleted' };
    }
    async sendReminder(id) {
        const request = await this.findOne(id);
        if (request.status !== 'approved' && request.status !== 'picked_up') {
            throw new common_1.BadRequestException('Can only send reminders for approved requests');
        }
        console.log('Reminder sent to:', request.borrowerEmail);
        return { message: 'Reminder sent' };
    }
    async findOverdueRequests() {
        const today = new Date();
        return await this.requestRepository.find({
            where: {
                status: 'approved',
                dueDate: (0, typeorm_2.LessThan)(today)
            },
            relations: ['equipment', 'student']
        });
    }
};
exports.CheckoutRequestsService = CheckoutRequestsService;
exports.CheckoutRequestsService = CheckoutRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(checkout_request_entity_1.CheckoutRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(equipment_entity_1.Equipment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CheckoutRequestsService);
//# sourceMappingURL=checkout-requests.service.js.map