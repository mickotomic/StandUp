import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiTags('app-payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/:subscriptionId')
  async paymentStripe(@Param('subscriptionId') subscriptionId: number) {
    return await this.paymentService.paymentStripe(+subscriptionId);
  }

  @ApiBearerAuth()
  @Get('/sucess/:subscriptionId')
  async success(
    @Param('subscriptionId') subscriptionId: number,
    @Query('token') token: string,
  ) {
    return await this.paymentService.success(+subscriptionId, token);
  }

  @ApiBearerAuth()
  @Get('/cancel/:subscriptionId')
  async cancel(@Param('subscriptionId') subscriptionId: number) {
    return await this.paymentService.cancel(+subscriptionId);
  }
}
