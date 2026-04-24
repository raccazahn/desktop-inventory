import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            email: any;
            role: any;
        };
    }>;
    register(userData: any): Promise<{
        id: number;
        username: string;
        email: string;
        role: string;
        full_name: string;
        phone: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
}
