import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly service: RestaurantService) {}

  /* ─── Menu ─── */
  @Get('menu')
  getMenu(@Query('category') category?: string) {
    return this.service.getMenuItems(category);
  }

  @Post('menu')
  createMenuItem(@Body() body: any) {
    return this.service.createMenuItem(body);
  }

  @Patch('menu/:id')
  updateMenuItem(@Param('id') id: string, @Body() body: any) {
    return this.service.updateMenuItem(id, body);
  }

  @Delete('menu/:id')
  deleteMenuItem(@Param('id') id: string) {
    return this.service.deleteMenuItem(id);
  }

  /* ─── Orders ─── */
  @Get('orders')
  getOrders(@Query('status') status?: string) {
    return this.service.getOrders(status);
  }

  @Get('orders/stats')
  getStats() {
    return this.service.getStats();
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.service.getOrder(id);
  }

  @Post('orders')
  createOrder(@Body() body: any) {
    return this.service.createOrder(body);
  }

  @Patch('orders/:id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string; treatedBy?: string }) {
    return this.service.updateOrderStatus(id, body.status, body.treatedBy);
  }

  @Patch('orders/:id/payment')
  updatePayment(@Param('id') id: string, @Body() body: { paymentStatus: string }) {
    return this.service.updatePaymentStatus(id, body.paymentStatus);
  }
}
