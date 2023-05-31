import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class RegenerateCodeDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
