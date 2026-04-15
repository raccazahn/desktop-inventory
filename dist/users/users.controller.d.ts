import { UsersService } from './users.service';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(role?: UserRole): Promise<import("../entities/user.entity").User[]>;
    findOne(id: string): Promise<import("../entities/user.entity").User>;
    create(createUserDto: CreateUserDto): Promise<Omit<import("../entities/user.entity").User, "password_hash">>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<import("../entities/user.entity").User, "password_hash">>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
