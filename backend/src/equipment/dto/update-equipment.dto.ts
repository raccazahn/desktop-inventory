import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateEquipmentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['Available', 'In Use', 'Unavailable', 'Under Maintenance', 'Reserved'])
  status?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['Excellent', 'Good', 'Fair', 'Poor'])
  condition?: string;

  @IsString()
  @IsOptional()
  category?: string;
}