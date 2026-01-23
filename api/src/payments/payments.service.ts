import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePaymentDto, PaymentProvider } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async initPayment(userId: string, dto: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found!');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Not your Order!');
    }

    if (order.status === 'PENDING') {
      throw new BadRequestException('Order already procced!');
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId: order.id,
        provider: dto.provider,
        amount: order.totalAmount,
        currency: 'BDT',
        status: 'INITIATED',
        providerRef: `TEMP-${Date.now()}`,
      },
    });

    if (dto.provider === PaymentProvider.STRIPE) {
      return this.initStripePayment(order, payment);
    }

    if (dto.provider === PaymentProvider.SSLCOMMERZ) {
      return this.initSSLPayment(order, payment);
    }

    throw new BadRequestException('Invalid payment provider!');
  }

  private async initStripePayment(order, payment) {
    return {
      gateway: 'STRIPE',
      redirectUrl: 'https://stripe-checkout-url',
      paymentId: payment.id,
    };
  }

  private async initSSLPayment(order, payment) {
    return {
      gateway: 'SSLCOMMERZ',
      redirectUrl: 'https://sslcommerz-url',
      paymentId: payment.id,
    };
  }
}
