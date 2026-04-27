import { IsString, IsNumber, IsOptional, IsEnum, IsArray, IsBoolean } from 'class-validator';

export enum VehicleType {
  LOCATION = 'LOCATION',
  VENTE = 'VENTE',
}

export class CreateVehicleDto {
  @IsString()
  marque: string;

  @IsString()
  modele: string;

  @IsNumber()
  annee: number;

  @IsEnum(VehicleType)
  type: VehicleType;

  @IsOptional()
  @IsNumber()
  pricePerDay?: number;

  @IsOptional()
  @IsNumber()
  priceSale?: number;

  @IsString()
  provinceId: string;

  @IsString()
  villeId: string;

  @IsOptional()
  @IsArray()
  photos?: string[];

  @IsOptional()
  @IsBoolean()
  availability?: boolean;
}

export class UpdateVehicleDto {
  @IsOptional()
  @IsNumber()
  pricePerDay?: number;

  @IsOptional()
  @IsNumber()
  priceSale?: number;

  @IsOptional()
  @IsBoolean()
  availability?: boolean;

  @IsOptional()
  @IsArray()
  photos?: string[];
}
