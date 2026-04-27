import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsEnum(['parallel', 'child', 'after', 'before'])
  type: 'parallel' | 'child' | 'after' | 'before';

  @IsString()
  @IsOptional()
  info?: string;

  @IsArray()
  @IsOptional()
  assignedUsers?: string[];

  status?: 'pending' | 'in_progress' | 'completed';
}
