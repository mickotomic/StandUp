import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";



export class FinishStandupDto {
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isPrevUserPresent: boolean;
}