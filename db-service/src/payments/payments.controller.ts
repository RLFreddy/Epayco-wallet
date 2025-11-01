import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags } from '@nestjs/swagger';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.OK)
  initiate(@Body() initiatePaymentDto: InitiatePaymentDto) {
    return this.paymentsService.initiate(initiatePaymentDto);
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  confirm(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    return this.paymentsService.confirm(confirmPaymentDto);
  }
}
