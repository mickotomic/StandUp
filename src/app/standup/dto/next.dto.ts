import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class NextDto {
  @ApiProperty({ type: [Number] })
  @IsString()
  @IsIn([ 'next', 'previous' ])
  direction: string;
}
