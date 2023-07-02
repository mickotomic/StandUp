import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TaskDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsIn(['low', 'medium', 'high'])
  priority: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsIn(['not_started', 'in_progress', 'done'])
  status: string;

  @ApiProperty()
  @IsNumber()
  workspaceId: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  deadline: Date;
}
