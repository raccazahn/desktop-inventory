import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            email: any;
            role: any;
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<{
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
