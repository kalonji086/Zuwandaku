import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { search?: string; status?: string }) {
    const where: any = { isActive: true };
    if (filters?.status) where.status = filters.status;
    if (filters?.search) {
      where.OR = [
        { number: { contains: filters.search, mode: 'insensitive' } },
        { type: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.roomHotel.findMany({ where, orderBy: { number: 'asc' } });
  }

  async findOne(id: string) {
    const room = await this.prisma.roomHotel.findUnique({ where: { id } });
    if (!room) throw new NotFoundException('Chambre introuvable');
    return room;
  }

  async create(data: any) {
    let { hotelId, price, ...rest } = data;

    // Résoudre hotelId si absent
    if (!hotelId) {
      const admin = await this.prisma.user.findFirst({
        where: { role: { in: ['ADMIN', 'HOTELIER'] } },
        select: { id: true },
      });
      hotelId = admin?.id;
    }

    if (!hotelId) throw new NotFoundException('Aucun hôtelier trouvé. Créez d\'abord un compte HOTELIER.');

    return this.prisma.roomHotel.create({
      data: {
        ...rest,
        pricePerNight: price ?? rest.pricePerNight ?? 0,
        hotelId,
      },
    });
  }

  async update(id: string, data: any) {
    const { price, hotelId, ...rest } = data;
    const updateData: any = { ...rest };
    if (price !== undefined) updateData.pricePerNight = price;
    return this.prisma.roomHotel.update({ where: { id }, data: updateData });
  }

  async remove(id: string) {
    return this.prisma.roomHotel.update({ where: { id }, data: { isActive: false } });
  }
}
