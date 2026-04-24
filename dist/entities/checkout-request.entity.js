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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutRequest = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const equipment_entity_1 = require("./equipment.entity");
let CheckoutRequest = class CheckoutRequest {
};
exports.CheckoutRequest = CheckoutRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CheckoutRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => equipment_entity_1.Equipment, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'equipment_id' }),
    __metadata("design:type", equipment_entity_1.Equipment)
], CheckoutRequest.prototype, "equipment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'equipment_id' }),
    __metadata("design:type", Number)
], CheckoutRequest.prototype, "equipmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", user_entity_1.User)
], CheckoutRequest.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_id' }),
    __metadata("design:type", Number)
], CheckoutRequest.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "borrowerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "borrowerEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], CheckoutRequest.prototype, "dueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: 'pending' }),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], CheckoutRequest.prototype, "adminNotes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CheckoutRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CheckoutRequest.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], CheckoutRequest.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], CheckoutRequest.prototype, "pickedUpAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], CheckoutRequest.prototype, "returnedAt", void 0);
exports.CheckoutRequest = CheckoutRequest = __decorate([
    (0, typeorm_1.Entity)('checkout_requests')
], CheckoutRequest);
//# sourceMappingURL=checkout-request.entity.js.map