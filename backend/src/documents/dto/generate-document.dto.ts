import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';

export enum DocumentCategory {
  CONTRAT_LOCATION_BIEN = 'CONTRAT_LOCATION_BIEN',
  CONTRAT_VENTE_BIEN = 'CONTRAT_VENTE_BIEN',
  CONTRAT_LOCATION_VEHICULE = 'CONTRAT_LOCATION_VEHICULE',
  CONTRAT_VENTE_VEHICULE = 'CONTRAT_VENTE_VEHICULE',
  RECU_PAIEMENT = 'RECU_PAIEMENT',
  MISE_EN_DEMEURE = 'MISE_EN_DEMEURE',
  CERTIFICAT_IMMATRICULATION = 'CERTIFICAT_IMMATRICULATION',
  CNI_PROPRIETAIRE = 'CNI_PROPRIETAIRE',
  LICENCE_PROFESSIONNELLE = 'LICENCE_PROFESSIONNELLE',
  PV_ASSEMBLEE = 'PV_ASSEMBLEE',
}

export class GenerateDocumentDto {
  @IsEnum(DocumentCategory)
  category: DocumentCategory;

  @IsString() bailleurNom: string;
  @IsString() bailleurCni: string;
  @IsString() bailleurAdresse: string;

  @IsString() locataireNom: string;
  @IsString() locataireCni: string;
  @IsString() locataireAdresse: string;

  @IsOptional() @IsString() bienAdresse?: string;
  @IsOptional() @IsString() bienDescription?: string;
  @IsOptional() @IsString() vehiculeMarque?: string;
  @IsOptional() @IsString() vehiculeModele?: string;
  @IsOptional() @IsString() vehiculePlaque?: string;

  @IsNumber() montant: number;
  @IsString() devise: string;

  @IsOptional() @IsString() dateDebut?: string;
  @IsOptional() @IsString() dateFin?: string;
  @IsOptional() @IsString() lieuSignature?: string;
}
