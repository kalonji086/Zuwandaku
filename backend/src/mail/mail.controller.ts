import { Controller, Post, Body, UseGuards, ValidationPipe } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';
import { MailService } from './mail.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';


@Controller('admin/mail')
@UseGuards(JwtAuthGuard, RoleGuard)

@Roles('ADMIN')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() dto: SendMailDto) {
    return await this.mailService.sendMail(dto);
  }
}
