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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findAll(role) {
        try {
            const query = this.userRepository.createQueryBuilder('user');
            if (role) {
                query.where('user.role = :role', { role });
            }
            return await query.select([
                'user.id',
                'user.username',
                'user.email',
                'user.role',
                'user.full_name',
                'user.phone',
                'user.is_active',
                'user.created_at',
            ]).getMany();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve users');
        }
    }
    async findOne(id) {
        try {
            if (!id || id <= 0) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const user = await this.userRepository
                .createQueryBuilder('user')
                .where('user.id = :id', { id })
                .select([
                'user.id',
                'user.username',
                'user.email',
                'user.role',
                'user.full_name',
                'user.phone',
                'user.is_active',
                'user.created_at',
                'user.updated_at',
            ])
                .getOne();
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            return user;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to retrieve user');
        }
    }
    async findByEmail(email) {
        try {
            return await this.userRepository.findOneBy({ email });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve user by email');
        }
    }
    async create(createUserDto) {
        try {
            if (!createUserDto.email || !createUserDto.password || !createUserDto.username) {
                throw new common_1.BadRequestException('Email, username, and password are required');
            }
            const existingUser = await this.userRepository.findOne({
                where: [
                    { email: createUserDto.email },
                    { username: createUserDto.username },
                ],
            });
            if (existingUser) {
                if (existingUser.email === createUserDto.email) {
                    throw new common_1.ConflictException('Email already exists');
                }
                if (existingUser.username === createUserDto.username) {
                    throw new common_1.ConflictException('Username already exists');
                }
            }
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const newUser = this.userRepository.create({
                username: createUserDto.username,
                email: createUserDto.email,
                password_hash: hashedPassword,
                role: createUserDto.role,
                full_name: createUserDto.full_name,
                phone: createUserDto.phone,
                is_active: true,
            });
            await this.userRepository.save(newUser);
            const { password_hash, ...userWithoutPassword } = newUser;
            return userWithoutPassword;
        }
        catch (error) {
            if (error instanceof common_1.ConflictException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to create user');
        }
    }
    async update(id, updateUserDto) {
        try {
            if (!id || id <= 0) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const user = await this.userRepository.findOneBy({ id });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            if (updateUserDto.email && updateUserDto.email !== user.email) {
                const existingEmail = await this.userRepository.findOneBy({
                    email: updateUserDto.email,
                });
                if (existingEmail) {
                    throw new common_1.ConflictException('Email already exists');
                }
            }
            if (updateUserDto.username && updateUserDto.username !== user.username) {
                const existingUsername = await this.userRepository.findOneBy({
                    username: updateUserDto.username,
                });
                if (existingUsername) {
                    throw new common_1.ConflictException('Username already exists');
                }
            }
            const updateData = { ...updateUserDto };
            if (updateUserDto.password) {
                updateData.password_hash = await bcrypt.hash(updateUserDto.password, 10);
                delete updateData.password;
            }
            await this.userRepository.update(id, updateData);
            const updatedUser = await this.userRepository.findOneBy({ id });
            const { password_hash, ...userWithoutPassword } = updatedUser;
            return userWithoutPassword;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to update user');
        }
    }
    async delete(id) {
        try {
            if (!id || id <= 0) {
                throw new common_1.BadRequestException('Invalid user ID');
            }
            const user = await this.userRepository.findOneBy({ id });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            await this.userRepository.delete(id);
            return { message: `User with ID ${id} has been deleted` };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to delete user');
        }
    }
    async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map