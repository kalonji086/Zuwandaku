import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(createVehicleDto: CreateVehicleDto, ownerId: string) {
    return this.prisma.vehicle.create({
      data: { ...createVehicleDto, ownerId },
      include: { owner: { select: { id: true, name: true } }, province: true, ville: true },
    });
  }

  async findAll(filters?: { provinceId?: string; villeId?: string; type?: string; availability?: boolean }) {
    const where: any = {};
    if (filters?.provinceId) where.provinceId = filters.provinceId;
    if (filters?.villeId) where.villeId = filters.villeId;
    if (filters?.type) where.type = filters.type;
    if (filters?.availability !== undefined) where.availability = filters.availability;

    return this.prisma.vehicle.findMany({
      where,
      include: { owner: { select: { id: true, name: true, phone: true } }, province: true, ville: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.vehicle.findUniqueOrThrow({
      where: { id },
      include: { owner: { select: { id: true, name: true, phone: true } }, province: true, ville: true, contracts: true },
    });
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto, userId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    if (vehicle.ownerId !== userId) throw new Error('Unauthorized');
    return this.prisma.vehicle.update({
      where: { id },
      data: updateVehicleDto,
      include: { owner: { select: { id: true, name: true } }, province: true, ville: true },
    });
  }

  async remove(id: string, userId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    if (vehicle.ownerId !== userId) throw new Error('Unauthorized');
    return this.prisma.vehicle.delete({ where: { id } });
  }

  async findByOwner(ownerId: string) {
    return this.prisma.vehicle.findMany({
      where: { ownerId },
      include: { province: true, ville: true, contracts: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
