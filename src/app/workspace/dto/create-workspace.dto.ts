import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @ApiProperty()
  @IsString()
  projectName: string;

  @ApiProperty({ description: 'Settings is not currently supported' })
  @IsString()
  settings: string;
}
