import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateCheckoutRequestDto {
  @IsNumber()
  @IsNotEmpty()
  equipmentId: number;

  @IsNumber()
  @IsOptional()
  studentId?: number;

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
}

export class UpdateCheckoutRequestDto {
  @IsString()
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected', 'picked_up', 'returned'])
  status?: string;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}