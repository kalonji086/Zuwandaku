import { IsEmail, IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export enum Role {
  ADMIN = 'ADMIN',
  PROPRIETAIRE = 'PROPRIETAIRE',
  CLIENT = 'CLIENT',
  COMMISSIONNAIRE = 'COMMISSIONNAIRE',
  HOTEL = 'HOTEL',
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export class CreateStaffDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsNumber()
  permissions?: number;
}

export class UpdateStaffDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
