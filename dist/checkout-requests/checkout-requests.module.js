"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const checkout_request_entity_1 = require("../entities/checkout-request.entity");
const equipment_entity_1 = require("../entities/equipment.entity");
const checkout_requests_controller_1 = require("./checkout-requests.controller");
const checkout_requests_service_1 = require("./checkout-requests.service");
let CheckoutRequestsModule = class CheckoutRequestsModule {
};
exports.CheckoutRequestsModule = CheckoutRequestsModule;
exports.CheckoutRequestsModule = CheckoutRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([checkout_request_entity_1.CheckoutRequest, equipment_entity_1.Equipment])],
        controllers: [checkout_requests_controller_1.CheckoutRequestsController],
        providers: [checkout_requests_service_1.CheckoutRequestsService],
        exports: [checkout_requests_service_1.CheckoutRequestsService],
    })
], CheckoutRequestsModule);
//# sourceMappingURL=checkout-requests.module.js.map