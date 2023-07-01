import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { User } from "src/entities/user.entity";


export class StandupDto { 
    
    @ApiProperty()
    @IsNumber()
    workspaceId: number;

    @ApiProperty()
  absentUsersId: User[];
}