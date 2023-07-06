import { Controller, Get } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { SummaryService } from "./summary.service";
import { Summary } from "src/entities/summary.entity";
import { Paginate, PaginateQuery, Paginated } from "nestjs-paginate";

@ApiTags('summary')
@Controller('summary')

export class SummaryController{
constructor (private readonly summaryService: SummaryService) {}

@Get('/:id')
@ApiQuery({ name:'page', required:false, type: 'number'})
@ApiQuery({ name:'limit', required:false, type: 'number'})
@ApiQuery({ name:'sortBy', required:false, type: 'array'})
@ApiQuery({ name:'searchBy', required:false, type: 'string'})
@ApiQuery({ name:'search', required:false, type: 'string'})
@ApiQuery({ name:'filer', required:false, type: 'object'})
@ApiQuery({ name:'select', required:false, type: 'string'})
@ApiQuery({ name:'path', required:false, type: 'string'})
@ApiQuery({ name: 'workspaceId' })
@ApiTags('summary')
 async getSummaryHistory(@Paginate() workspaceId: number , query: PaginateQuery): Promise<Paginated<Summary>>{
    return this.summaryService.getSummaryHistory(workspaceId, query)
 }
}