import { ApiProperty } from '@nestjs/swagger';


type actionTypeT =  "start" | "finish"

export class StandUpDto {
  type: actionTypeT;
}
