import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export class UpdateUserStatusDto {
  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
}

export class ApproveRequestDto {
  @IsString()
  @IsOptional()
  adminNote?: string;
}

export class GetPendingRequestsDto {
  @IsOptional()
  type?: 'ACCOUNT_CHANGE' | 'ACCOUNT_CREATION' | 'PURCHASE' | 'RENTAL_VEHICLE' | 'RENTAL_PROPERTY';
}
