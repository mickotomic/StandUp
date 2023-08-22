import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateWorkspaceDto {
  @ApiProperty()
  @IsString()
  @Length(1, undefined, {
    message: 'projectName must have at least 1 character',
  })
  projectName: string;

  @ApiProperty({ description: 'Settings is not currently supported' })
  @IsString()
  settings: string;
}
