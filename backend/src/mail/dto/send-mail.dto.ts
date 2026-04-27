import { IsEmail, IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class SendMailDto {
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  html: string;

  @IsOptional()
  @Type(() => AttachmentDto)
  @IsArray()
  attachments?: AttachmentDto[];

  @IsOptional()
  @IsEnum(['thumbsup', 'heart', 'star', 'fire', 'rocket'])
  sticker?: string;
}

class AttachmentDto {
  @IsString()
  filename: string;

  @IsOptional()
  @IsString()
  path?: string;
}
