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

    if (order.status !== 'PENDING') {
      throw new BadRequestException('Order already processed!');
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

    if (dto.provider === PaymentProvider.MOCK) {
      return {
        gateway: 'MOCK',
        paymentId: payment.id,
        message: 'Mock payment initiated. Trigger callback to complete.',
      };
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

  async handleMockSuccess(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found!');
    }

    if (payment.provider !== 'MOCK') {
      throw new BadRequestException('Invalid provider callback');
    }

    if (payment.status === 'SUCCESS') {
      return { message: 'Payment already completed!' };
    }

    if (payment.status !== 'INITIATED') {
      return { message: 'Payment already processed!' };
    }

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'SUCCESS',
          providerRef: `MOCK_SUCCESS_${Date.now()}`,
        },
      }),

      this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'PAID' },
      }),
    ]);

    return {
      success: true,
      orderId: payment.orderId,
    };
  }

  async handleMockFail(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found!');
    }

    if (payment.provider !== 'MOCK') {
      throw new BadRequestException('Invalid provider callback');
    }

    if (payment.status !== 'INITIATED') {
      return { message: 'Payment already processed!' };
    }

    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          providerRef: `MOCK_FAILED_${Date.now()}`,
        },
      }),

      this.prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: 'CANCELLED',
        },
      }),
    ]);

    return {
      success: false,
      orderId: payment.orderId,
    };
  }
}
