import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDossierDto } from './dto/create-dossier.dto';
import { UpdateDossierDto } from './dto/update-dossier.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class DossiersService {
  constructor(private prisma: PrismaService) {}

  async create(createDossierDto: CreateDossierDto) {
    return this.prisma.dossier.create({
      data: createDossierDto,
      include: {
        client: true,
        responsable: true,
        tasks: true,
      },
    });
  }

  async findAll() {
    return this.prisma.dossier.findMany({
      include: {
        client: true,
        responsable: true,
        tasks: {
          include: {
            assignee: true,
            comments: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.dossier.findUnique({
      where: { id },
      include: {
        client: true,
        responsable: true,
        tasks: {
          include: {
            assignee: true,
            comments: true,
          },
        },
      },
    });
  }

  async update(id: string, updateDossierDto: UpdateDossierDto) {
    return this.prisma.dossier.update({
      where: { id },
      data: updateDossierDto,
    });
  }

  async remove(id: string) {
    return this.prisma.dossier.delete({ where: { id } });
  }

  // Tasks
  async createTask(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: createTaskDto,
      include: {
        assignee: true,
        dossier: true,
      },
    });
  }

  async getTasksByDossier(dossierId: string) {
    return this.prisma.task.findMany({
      where: { dossierId },
      include: {
        assignee: true,
        comments: true,
      },
    });
  }
}

