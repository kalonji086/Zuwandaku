import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProvincesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.province.findMany({
      include: {
        villes: true,
        _count: { select: { properties: true, vehicles: true } },
      },
      orderBy: { nom: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.province.findUnique({
      where: { id },
      include: {
        villes: { include: { quartiers: true } },
        _count: { select: { properties: true, vehicles: true } },
      },
    });
  }
}
