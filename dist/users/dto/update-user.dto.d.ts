export declare enum UserRole {
    ADMIN = "admin",
    TECHNICIAN = "technician",
    FACULTY = "faculty",
    STUDENT = "student"
}
export declare class UpdateUserDto {
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    full_name?: string;
    phone?: string;
}
