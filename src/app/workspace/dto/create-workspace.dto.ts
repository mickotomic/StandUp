import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';

export class CreateWorkspaceDto {
  @ApiProperty()
  @IsString()
  @Length(1, 255, {
    message: returnMessages.BadProjectNameLength,
  })
  projectName: string;

  @ApiProperty({ description: 'Settings is not currently supported' })
  @IsString()
  settings: string;
}
