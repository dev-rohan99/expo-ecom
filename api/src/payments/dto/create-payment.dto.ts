import { IsEnum, IsString } from 'class-validator';

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  SSLCOMMERZ = 'SSLCOMMERZ',
}

export class CreatePaymentDto {
  @IsString()
  orderId: string;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;
}
