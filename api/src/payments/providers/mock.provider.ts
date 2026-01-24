import { Injectable } from '@nestjs/common';
import { PaymentProvider } from './payment-provider.interface';

@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  async pay(orderId: string, amount: number) {
    return {
      success: true,
      transactionId: `MOCK_TXN_${Date.now()}`,
    };
  }
}
