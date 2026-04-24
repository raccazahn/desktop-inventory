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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'username', 'email', 'password_hash', 'role', 'full_name', 'phone', 'is_active'],
        });
        if (!user || !user.password_hash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const { password_hash, ...result } = user;
        return result;
    }
    async login(user) {
        const payload = {
            username: user.username,
            sub: user.id,
            role: user.role,
            email: user.email
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        };
    }
    async register(userData) {
        const existingUser = await this.userRepository.findOne({
            where: [{ email: userData.email }, { username: userData.username }],
        });
        if (existingUser) {
            if (existingUser.email === userData.email) {
                throw new common_1.ConflictException('Email already exists');
            }
            if (existingUser.username === userData.username) {
                throw new common_1.ConflictException('Username already exists');
            }
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = this.userRepository.create({
            username: userData.username,
            email: userData.email,
            password_hash: hashedPassword,
            role: userData.role,
            full_name: userData.full_name,
            phone: userData.phone,
            is_active: true,
        });
        await this.userRepository.save(newUser);
        const { password_hash, ...result } = newUser;
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map