import { IsString, IsNumber, IsEnum, IsArray, IsOptional } from 'class-validator';

export enum PropertyType {
  MAISON = 'MAISON',
  PARCELLE = 'PARCELLE',
  APPARTEMENT = 'APPARTEMENT',
  BUREAU = 'BUREAU',
  HOTEL = 'HOTEL',
}

export class CreatePropertyDto {
  @IsString()
  @IsOptional()
  quartier?: string;

  @IsString()
  @IsOptional()
  quartierId?: string;

  @IsString()
  provinceId: string;

  @IsString()
  villeId: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsEnum(PropertyType)
  type: PropertyType;

  @IsArray()
  @IsOptional()
  photos?: string[];

  @IsNumber()
  @IsOptional()
  surface?: number;
}
