import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  /* ─── Menu Items ─── */
  async getMenuItems(category?: string) {
    return this.prisma.restaurantMenuItem.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  async createMenuItem(data: any) {
    return this.prisma.restaurantMenuItem.create({ data });
  }

  async updateMenuItem(id: string, data: any) {
    return this.prisma.restaurantMenuItem.update({ where: { id }, data });
  }

  async deleteMenuItem(id: string) {
    return this.prisma.restaurantMenuItem.delete({ where: { id } });
  }

  /* ─── Orders ─── */
  async getOrders(status?: string) {
    return this.prisma.restaurantOrder.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        items: {
          include: { menuItem: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrder(id: string) {
    const order = await this.prisma.restaurantOrder.findUnique({
      where: { id },
      include: { items: { include: { menuItem: true } } },
    });
    if (!order) throw new NotFoundException('Commande introuvable');
    return order;
  }

  async createOrder(data: any) {
    const { items, ...orderData } = data;

    const orderNumber = `RES-${Date.now().toString().slice(-6)}`;

    return this.prisma.restaurantOrder.create({
      data: {
        ...orderData,
        orderNumber,
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { items: { include: { menuItem: true } } },
    });
  }

  async updateOrderStatus(id: string, status: string, treatedBy?: string) {
    return this.prisma.restaurantOrder.update({
      where: { id },
      data: {
        status: status as any,
        ...(status === 'EN_PREPARATION' || status === 'PRET' || status === 'LIVRE'
          ? { treatedBy, treatedAt: new Date() }
          : {}),
      },
      include: { items: { include: { menuItem: true } } },
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: string) {
    return this.prisma.restaurantOrder.update({
      where: { id },
      data: { paymentStatus: paymentStatus as any },
    });
  }

  async getStats() {
    const [total, enAttente, enPreparation, pret, livre, revenue] = await Promise.all([
      this.prisma.restaurantOrder.count(),
      this.prisma.restaurantOrder.count({ where: { status: 'EN_ATTENTE' } }),
      this.prisma.restaurantOrder.count({ where: { status: 'EN_PREPARATION' } }),
      this.prisma.restaurantOrder.count({ where: { status: 'PRET' } }),
      this.prisma.restaurantOrder.count({ where: { status: 'LIVRE' } }),
      this.prisma.restaurantOrder.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { totalAmount: true },
      }),
    ]);
    return {
      total,
      enAttente,
      enPreparation,
      pret,
      livre,
      revenue: revenue._sum.totalAmount ?? 0,
    };
  }
}
