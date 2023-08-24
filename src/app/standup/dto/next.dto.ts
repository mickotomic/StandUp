import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class NextDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsIn([ 'next', 'previous' ])
  direction: string;
  
}
