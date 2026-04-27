import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class CreateProcedureDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  group: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  tasks?: CreateTaskDto[];
}
