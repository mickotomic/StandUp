import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsEmail } from 'class-validator';

export class CodeVerificationDto {
  @ApiProperty()
  @IsString()
  @Length(6)
  token: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
