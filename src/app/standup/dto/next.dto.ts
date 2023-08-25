import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class NextDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsIn(['next', 'previous'])
  direction: string;
}
