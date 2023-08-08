import { ApiProperty } from '@nestjs/swagger';

export class DeleteUsersDto {
  @ApiProperty()
  userId: number;
}
