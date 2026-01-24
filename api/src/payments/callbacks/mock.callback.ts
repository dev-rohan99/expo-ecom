import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from '../payments.service';

@Controller('payments/callback/mock')
export class MockCallbackController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('success')
  success(@Body() body: { paymentId: string }) {
    return this.paymentsService.handleMockSuccess(body.paymentId);
  }

  @Post('fail')
  fail(@Body() body: { paymentId: string }) {
    return this.paymentsService.handleMockFail(body.paymentId);
  }
}
