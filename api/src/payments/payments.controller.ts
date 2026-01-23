import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@UseGuards(ClerkAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('init')
  initPayment(@Req() req, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.initPayment(req.auth.userId, dto);
  }
}
