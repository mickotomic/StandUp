import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerificationCodeDto {
  @ApiProperty()
  @IsString()
  @Length(6)
    token: string;

  @ApiProperty()
  @IsEmail()
    email: string;
}
