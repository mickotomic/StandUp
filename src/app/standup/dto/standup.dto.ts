import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class StandupDto {
  @ApiProperty()
  @IsNumber()
  workspaceId: number;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  absentUsersId: number[];
}
