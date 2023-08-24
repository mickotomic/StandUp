import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class StandupDto {
  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  absentUsersId: number[];

  
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPrevUserPresent: boolean;

}
