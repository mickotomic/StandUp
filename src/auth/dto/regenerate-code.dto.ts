import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RegenerateCodeDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
