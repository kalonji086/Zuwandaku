import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemberAssignationService {
  constructor(private prisma: PrismaService) {}

  async getDossiers(search?: string, status?: string, type?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { reference: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    return this.prisma.dossier.findMany({
      where,
      include: {
        client: { select: { id: true, name: true, email: true } },
        responsable: { select: { id: true, name: true, email: true, role: true } },
        tasks: {
          include: { assignee: { select: { id: true, name: true, email: true, role: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAvailableUsers(search?: string, role?: string, excludeUserIds: string[] = []) {
    const where: any = {
      isActive: true,
      id: { notIn: excludeUserIds },
    };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) where.role = role;
    return this.prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: 'asc' },
    });
  }

  async setResponsable(dossierId: string, userId: string | null) {
    return this.prisma.dossier.update({
      where: { id: dossierId },
      data: { responsableId: userId },
      include: {
        responsable: { select: { id: true, name: true, email: true, role: true } },
      },
    });
  }

  async assignMember(dossierId: string, userId: string) {
    // Create a task linked to this dossier for this member if not already assigned
    const existing = await this.prisma.task.findFirst({
      where: { dossierId, assigneeId: userId },
    });
    if (existing) return existing;
    return this.prisma.task.create({
      data: {
        name: 'member-assignation',
        titre: 'Membre assigné',
        dossierId,
        assigneeId: userId,
        status: 'IN_PROGRESS',
      },
      include: { assignee: { select: { id: true, name: true, email: true, role: true } } },
    });
  }

  async removeMember(dossierId: string, userId: string) {
    return this.prisma.task.deleteMany({
      where: { dossierId, assigneeId: userId, name: 'member-assignation' },
    });
  }

  async getDossierMembers(dossierId: string) {
    return this.prisma.dossier.findUnique({
      where: { id: dossierId },
      include: {
        client: { select: { id: true, name: true, email: true } },
        responsable: { select: { id: true, name: true, email: true, role: true } },
        tasks: {
          where: { name: 'member-assignation' },
          include: { assignee: { select: { id: true, name: true, email: true, role: true } } },
        },
      },
    });
  }

  // Legacy: assignToDossier kept for compatibility
  async assignToDossier(dossierId: string, userId: string, type: 'responsable' | 'member') {
    if (type === 'responsable') return this.setResponsable(dossierId, userId);
    return this.assignMember(dossierId, userId);
  }
}
