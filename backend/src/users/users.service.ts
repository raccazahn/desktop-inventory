import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Retrieve all users (filtered by role if needed)
   */
  async findAll(role?: UserRole): Promise<User[]> {
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
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  /**
   * Find a user by ID (exclude password_hash)
   */
  async findOne(id: number): Promise<User | null> {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid user ID');
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
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  /**
   * Find a user by email (used for login)
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOneBy({ email });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve user by email');
    }
  }

  /**
   * Create a new user with hashed password
   */
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password_hash'>> {
    try {
      // Validate input
      if (!createUserDto.email || !createUserDto.password || !createUserDto.username) {
        throw new BadRequestException('Email, username, and password are required');
      }

      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      });

      if (existingUser) {
        if (existingUser.email === createUserDto.email) {
          throw new ConflictException('Email already exists');
        }
        if (existingUser.username === createUserDto.username) {
          throw new ConflictException('Username already exists');
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Create user entity
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

      // Return user without password hash
      const { password_hash, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  /**
   * Update user by ID
   */
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password_hash'>> {
    try {
      // Validate ID
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid user ID');
      }

      // Find existing user
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Check for email/username conflicts
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingEmail = await this.userRepository.findOneBy({
          email: updateUserDto.email,
        });
        if (existingEmail) {
          throw new ConflictException('Email already exists');
        }
      }

      if (updateUserDto.username && updateUserDto.username !== user.username) {
        const existingUsername = await this.userRepository.findOneBy({
          username: updateUserDto.username,
        });
        if (existingUsername) {
          throw new ConflictException('Username already exists');
        }
      }

      // Hash password if provided
      const updateData: Partial<User> = { ...updateUserDto };
      if (updateUserDto.password) {
        updateData.password_hash = await bcrypt.hash(updateUserDto.password, 10);
        delete (updateData as any).password;
      }

      // Update user
      await this.userRepository.update(id, updateData);
      const updatedUser = await this.userRepository.findOneBy({ id });

      // Return user without password hash
      const { password_hash, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  /**
   * Delete user by ID
   */
  async delete(id: number): Promise<{ message: string }> {
    try {
      // Validate ID
      if (!id || id <= 0) {
        throw new BadRequestException('Invalid user ID');
      }

      // Check if user exists
      const user = await this.userRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Delete user
      await this.userRepository.delete(id);
      return { message: `User with ID ${id} has been deleted` };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  /**
   * Verify password against hash (for login)
   */
  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
