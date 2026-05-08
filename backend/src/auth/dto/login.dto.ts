import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    example: 'admin@test.com', 
    description: 'User email address' 
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @ApiProperty({ 
    example: 'password123', 
    description: 'User password (min 8 characters)' 
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(8)
  password: string;
}