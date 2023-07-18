import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
