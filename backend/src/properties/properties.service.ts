import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PropertyCreateInput) {
    return this.prisma.property.create({ data });
  }

  async findAll(filters?: { type?: string; provinceId?: string; villeId?: string; status?: string }) {
    const where: Prisma.PropertyWhereInput = {};
    if (filters?.type) where.type = filters.type as any;
    if (filters?.provinceId) where.provinceId = filters.provinceId;
    if (filters?.villeId) where.villeId = filters.villeId;
    if (filters?.status) where.status = filters.status as any;

    return this.prisma.property.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, phone: true } },
        province: true,
        ville: true,
        quartier: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, phone: true } },
        province: true,
        ville: true,
        quartier: true,
      },
    });
  }

  async findByOwner(ownerId: string) {
    return this.prisma.property.findMany({
      where: { ownerId },
      include: { province: true, ville: true, quartier: true, contracts: { include: { client: { select: { id: true, name: true, phone: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: Prisma.PropertyUpdateInput) {
    return this.prisma.property.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.property.delete({ where: { id } });
  }
}
