import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as dto from './dto';

@Injectable()
export class ProcedureService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.procedure.findMany({
      include: { tasks: { include: { comments: true, assignee: true } } },
    });
  }

  async findOne(id: string) {
    const procedure = await this.prisma.procedure.findUnique({
      where: { id },
      include: {
        tasks: { include: { comments: { include: { user: true } }, assignee: true } },
      },
    });
    if (!procedure) throw new NotFoundException('Procedure not found');
    return procedure;
  }

  async create(createProcedureDto: dto.CreateProcedureDto) {
    return this.prisma.procedure.create({
      data: {
        name: createProcedureDto.name,
        description: createProcedureDto.description,
        group: createProcedureDto.group,
        tasks: {
          create: createProcedureDto.tasks?.map((task) => ({
            name: task.name,
            titre: task.name,
            type: task.type?.toUpperCase() as any,
            info: task.info,
            status: 'PENDING',
          })) || [],
        },
      },
      include: { tasks: { include: { comments: true } } },
    });
  }

  async updateTask(id: string, updateTaskDto: dto.UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto as any,
      include: { comments: true },
    });
  }

  async createComment(createCommentDto: dto.CreateCommentDto) {
    return this.prisma.comment.create({
      data: createCommentDto as any,
      include: { task: true, user: true },
    });
  }
}
