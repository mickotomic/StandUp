import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PaymentDto {
  @ApiProperty()
  @IsNumber()
  subscriptionId: number;

  @ApiProperty()
  @IsNumber()
  amount: number;
}
