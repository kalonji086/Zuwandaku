import { IsString, IsOptional, IsEnum, IsDateString, MinLength } from 'class-validator';

export enum DossierType {
  LOCATION_MAISON = 'LOCATION_MAISON',
  LOCATION_VEHICULE = 'LOCATION_VEHICULE',
  VENTE = 'VENTE',
  MAINTENANCE = 'MAINTENANCE',
  LITIGE = 'LITIGE',
  HOTEL_BOOKING = 'HOTEL_BOOKING',
}

export enum DossierStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  FINALISE = 'FINALISE',
  ANNULE = 'ANNULE',
}

export class CreateDossierDto {
  @IsString()
  @MinLength(5)
  reference: string;

  @IsEnum(DossierType)
  type: DossierType;

  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  responsableId?: string;

  @IsOptional()
  @IsString()
  bienPropertyId?: string;

  @IsOptional()
  @IsString()
  bienVehicleId?: string;

  @IsOptional()
  @IsString()
  contractId?: string;

  @IsOptional()
  @IsEnum(DossierStatus)
  status?: DossierStatus;

  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
