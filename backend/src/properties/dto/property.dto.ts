import { IsString, IsNumber, IsOptional, IsEnum, IsArray } from 'class-validator';
import { PropertyType, Status } from '@prisma/client';

export class CreatePropertyDto {
  @IsEnum(PropertyType)
  type: PropertyType;

  @IsString()
  provinceId: string;

  @IsString()
  villeId: string;

  @IsOptional()
  @IsString()
  quartierId?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  surface?: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  photos?: string[];

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;
}

export class UpdatePropertyDto {
  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  photos?: string[];

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;
}
