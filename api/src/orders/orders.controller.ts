import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { OrdersService } from './orders.service';

@UseGuards(ClerkAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  createOrder(@Req() req) {
    return this.orderService.createOrderFromCart(req.auth.userId);
  }

  @Get()
  getMyOrders(@Req() req) {
    return this.orderService.getMyOrders(req.auth.userId);
  }
}
