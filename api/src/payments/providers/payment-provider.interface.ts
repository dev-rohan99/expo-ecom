export interface PaymentProvider {
  pay(
    orderId: string,
    amount: number,
  ): Promise<{
    success: boolean;
    transactionId: string;
  }>;
}
