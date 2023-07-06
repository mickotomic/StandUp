import { Module } from "@nestjs/common";
import { SummaryService } from "./summary.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Summary } from "src/entities/summary.entity";
import { SummaryController } from "./summary.controller";



@Module({
    imports: [TypeOrmModule.forFeature([Summary])],
    controllers: [SummaryController],
    providers: [SummaryService],
})
export class SummaryModule{}