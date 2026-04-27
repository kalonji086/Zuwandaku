import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsUUID()
  taskId: string;

  @IsUUID()
  userId: string;
}
