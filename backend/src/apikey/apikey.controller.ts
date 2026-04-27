import { Controller, Post, Get, Delete, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiKeyService } from './apikey.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin/apikey')
@UseGuards(JwtAuthGuard)
@Roles(Role.ADMIN)
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

@Post()
  create(@Body('role') role: string) {
    return this.apiKeyService.generate(role as any);
  }

  @Get()
  findAll() {
    return this.apiKeyService.findAll();
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.apiKeyService.delete(id);
  }
}

