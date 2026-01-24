import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MockCallbackController } from './callbacks/mock.callback';

@Module({
  providers: [PaymentsService],
  controllers: [PaymentsController, MockCallbackController],
})
export class PaymentsModule {}
