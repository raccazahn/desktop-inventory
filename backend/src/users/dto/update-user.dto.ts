import {
  IsEmail,
  MinLength,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  TECHNICIAN = 'technician',
  FACULTY = 'faculty',
  STUDENT = 'student',
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: `Role must be one of: ${Object.values(UserRole).join(', ')}`,
  })
  role?: UserRole;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
