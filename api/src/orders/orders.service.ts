import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrderFromCart(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });

    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('Cart id empty!');
    }

    let totalAmount = 0;

    for (const item of cart.cartItems) {
      const product = item.product;

      if (!product || !product.isActive) {
        throw new NotFoundException(`Product unavailable: ${item.productId}`);
      }

      if (item.quantity < product.stock) {
        throw new BadRequestException(
          `Insufficient stock for ${product.title}`,
        );
      }

      totalAmount += item.quantity * product.price;
    }

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
        },
      });

      for (const item of cart.cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
        });

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        await tx.cartItem.deleteMany({ where: { cartId: item.cartId } });

        return order;
      }
    });
  }

  async getMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true, items: { include: { product: true } } },
    });
  }

  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({ where: { id }, data: { status } });
  }
}
