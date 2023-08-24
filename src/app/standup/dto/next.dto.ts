import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, IsIn } from "class-validator";



export class NextDto {
    @ApiProperty()
    @IsString()
    @IsIn(['next', 'previous'])
    direction: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isPrevUserPresent: boolean;

}