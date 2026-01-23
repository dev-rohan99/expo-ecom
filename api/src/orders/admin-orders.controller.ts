import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { OrdersService } from './orders.service';

UseGuards(ClerkAuthGuard, AdminGuard);
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get()
  getAllOrders() {
    return this.orderService.getAllOrders;
  }
}
