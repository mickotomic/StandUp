import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StandUpDto {
  @ApiProperty()
  @IsString()
  start: 'start';

  @ApiProperty()
  @IsString()
  finish: 'finish';
}
