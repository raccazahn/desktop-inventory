import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateCheckoutDto {
  @IsNumber()
  @IsNotEmpty()
  equipmentId: number;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsNotEmpty()
  borrowerName: string;

  @IsString()
  @IsNotEmpty()
  borrowerEmail: string;

  @IsString()
  @IsNotEmpty()
  dueDate: string;

  @IsString()
  @IsNotEmpty()
  purpose: string;

  @IsString()
  @IsOptional()
  @IsEnum(['borrowed', 'returned', 'overdue'])
  status?: string;
}