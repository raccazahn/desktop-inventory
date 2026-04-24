import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAll(role?: UserRole): Promise<User[]>;
    findOne(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(createUserDto: CreateUserDto): Promise<Omit<User, 'password_hash'>>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password_hash'>>;
    delete(id: number): Promise<{
        message: string;
    }>;
    verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
