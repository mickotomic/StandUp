import { Controller, Get, Param } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { SummaryService } from "./summary.service";
import { Summary } from "src/entities/summary.entity";
import { Paginate, PaginateQuery, Paginated } from "nestjs-paginate";

@ApiTags('summary')
@Controller('summary')

export class SummaryController{
constructor (private readonly summaryService: SummaryService) {}

   @ApiTags('summary')
   @ApiQuery({ name:'page', required: false, type: 'number'})
   @ApiQuery({ name:'limit', required: false, type: 'number'})
   @Get('/:workspaceId')
   async getSummaryHistory(@Param('workspaceId') workspaceId: number, @Paginate() query: PaginateQuery): Promise<Paginated<Summary>>{
      return this.summaryService.getSummaryHistory(workspaceId, query)
   }
}