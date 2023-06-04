import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class VerifyTokenDto {
  @ApiProperty()
  @IsNumber()
    workspaceId: number;

  @ApiProperty()
  @IsEmail()
    email: string;

  @ApiProperty()
  @IsString()
    token: string;
}
