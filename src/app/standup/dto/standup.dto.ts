import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsOptional,
} from 'class-validator';

export class StandupDto {
  @ApiProperty()
  @IsIn(['next', 'previous'])
  direction: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPrevUserPresent: boolean;
}
