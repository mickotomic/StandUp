import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsString } from 'class-validator';

export class UpdateAdminSubscriptionDto {
  @ApiProperty()
  @IsString()
  @IsIn(['paid', 'unpaid', 'refunded', 'canceled'])

  status:  'paid' | 'unpaid' | 'refunded' | 'canceled';
}