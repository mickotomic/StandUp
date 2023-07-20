import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateAdminUserDto {
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
