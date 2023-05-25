import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNumber } from 'class-validator';

export class CodeVerificationDto {
  @ApiProperty()
  @IsString()
  @Length(6)
  token: string;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
