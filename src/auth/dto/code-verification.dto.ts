import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail } from 'class-validator';

export class VerificationCodeDto {
  @ApiProperty()
  @IsString()
  @Length(6)
  token: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
