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
exports.Maintenance = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const equipment_entity_1 = require("./equipment.entity");
let Maintenance = class Maintenance {
};
exports.Maintenance = Maintenance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Maintenance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Maintenance.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Maintenance.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'scheduled' }),
    __metadata("design:type", String)
], Maintenance.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Maintenance.prototype, "scheduled_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Maintenance.prototype, "completed_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Maintenance.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Maintenance.prototype, "technician_notes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Maintenance.prototype, "equipment_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Maintenance.prototype, "assigned_to", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Maintenance.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Maintenance.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => equipment_entity_1.Equipment),
    __metadata("design:type", equipment_entity_1.Equipment)
], Maintenance.prototype, "equipment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Maintenance.prototype, "assigned_to_user", void 0);
exports.Maintenance = Maintenance = __decorate([
    (0, typeorm_1.Entity)('maintenance')
], Maintenance);
//# sourceMappingURL=maintenance.entity.js.map