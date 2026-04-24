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
exports.CheckoutRequestsController = void 0;
const common_1 = require("@nestjs/common");
const checkout_requests_service_1 = require("./checkout-requests.service");
const create_checkout_request_dto_1 = require("./dto/create-checkout-request.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
let CheckoutRequestsController = class CheckoutRequestsController {
    constructor(service) {
        this.service = service;
    }
    create(req, createDto) {
        return this.service.create(req.user.userId, createDto);
    }
    findMyRequests(req) {
        return this.service.findByStudent(req.user.userId);
    }
    findAll(status) {
        return this.service.findAll(status);
    }
    findOne(id) {
        return this.service.findOne(+id);
    }
    updateStatus(id, updateDto) {
        return this.service.updateStatus(+id, updateDto);
    }
    remove(id) {
        return this.service.remove(+id);
    }
    sendReminder(id) {
        return this.service.sendReminder(+id);
    }
};
exports.CheckoutRequestsController = CheckoutRequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_checkout_request_dto_1.CreateCheckoutRequestDto]),
    __metadata("design:returntype", void 0)
], CheckoutRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CheckoutRequestsController.prototype, "findMyRequests", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'technician'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CheckoutRequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'technician'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CheckoutRequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'technician'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_checkout_request_dto_1.UpdateCheckoutRequestDto]),
    __metadata("design:returntype", void 0)
], CheckoutRequestsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CheckoutRequestsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/reminder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin', 'technician'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CheckoutRequestsController.prototype, "sendReminder", null);
exports.CheckoutRequestsController = CheckoutRequestsController = __decorate([
    (0, common_1.Controller)('api/checkout-requests'),
    __metadata("design:paramtypes", [checkout_requests_service_1.CheckoutRequestsService])
], CheckoutRequestsController);
//# sourceMappingURL=checkout-requests.controller.js.map