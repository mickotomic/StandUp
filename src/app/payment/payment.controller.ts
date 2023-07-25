import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymantService } from './payment.service';

@ApiTags('app-payment')
@Controller('payment')
@ApiBearerAuth()
export class PaymantController {
  constructor(private readonly paymentService: PaymantService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async finishStandup(@Param('subscriptionId') subscriptionId: number) {
    return await this.paymentService.paymentStripe(+subscriptionId);
  }

  @ApiBearerAuth()
  @Get('/sucess/:subscriptionId')
  async sucess(
    @Param('subscriptionId') subscriptionId: number,
    @Query('token') token: string,
  ) {
    return await this.paymentService.sucess(+subscriptionId, token);
  }

  @ApiBearerAuth()
  @Get('/cancel/:subscriptionId')
  async cancel(@Param('subscriptionId') subscriptionId: number) {
    return await this.paymentService.cancel(+subscriptionId);
  }
}
