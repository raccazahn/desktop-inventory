"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const equipment_entity_1 = require("../entities/equipment.entity");
const equipment_controller_1 = require("./equipment.controller");
const equipment_service_1 = require("./equipment.service");
let EquipmentModule = class EquipmentModule {
};
exports.EquipmentModule = EquipmentModule;
exports.EquipmentModule = EquipmentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([equipment_entity_1.Equipment])],
        controllers: [equipment_controller_1.EquipmentController],
        providers: [equipment_service_1.EquipmentService],
        exports: [equipment_service_1.EquipmentService],
    })
], EquipmentModule);
//# sourceMappingURL=equipment.module.js.map