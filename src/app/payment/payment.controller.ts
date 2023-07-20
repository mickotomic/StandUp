import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentDto } from './dto/payment.dto';
import { PaymantService } from './payment.service';

@ApiTags('app-payment')
@Controller('payment')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class PaymantController {
  constructor(private readonly paymentService: PaymantService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async finishStandup(@Body() dto: PaymentDto) {
    return await this.paymentService.paymentStripe(
      +dto.subscriptionId,
      +dto.amount,
    );
  }
}
