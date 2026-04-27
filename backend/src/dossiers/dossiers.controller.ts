import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DossiersService } from './dossiers.service';
import { CreateDossierDto } from './dto/create-dossier.dto';
import { UpdateDossierDto } from './dto/update-dossier.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('dossiers')
export class DossiersController {
  constructor(private readonly dossiersService: DossiersService) {}

  @Post()
@UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  create(@Body() createDossierDto: CreateDossierDto) {
    return this.dossiersService.create(createDossierDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.dossiersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.dossiersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateDossierDto: UpdateDossierDto) {
    return this.dossiersService.update(id, updateDossierDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.dossiersService.remove(id);
  }

  @Post(':dossierId/tasks')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  createTask(@Param('dossierId') dossierId: string, @Body() createTaskDto: any) {
    return this.dossiersService.createTask({ ...createTaskDto, dossierId });
  }

  @Get(':dossierId/tasks')
  @UseGuards(JwtAuthGuard)
  getTasks(@Param('dossierId') dossierId: string) {
    return this.dossiersService.getTasksByDossier(dossierId);
  }
}

