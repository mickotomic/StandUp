import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @ApiProperty()
  @IsString()
  projectName: string;

  @ApiProperty()
  @IsString()
  settings: string;
}
