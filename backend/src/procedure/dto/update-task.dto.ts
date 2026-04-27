import { IsEnum, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsEnum(['pending', 'in_progress', 'completed'])
  status?: 'pending' | 'in_progress' | 'completed';

  @IsOptional()
  info?: string;
}
