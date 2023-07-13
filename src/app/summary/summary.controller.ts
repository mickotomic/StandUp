import { Controller, Get, Param } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Summary } from 'src/entities/summary.entity';
import { SummaryService } from './summary.service';

@ApiTags('summary')
@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @Get('/:workspaceId')
  async getSummaryHistory(
    @Param('workspaceId') workspaceId: number,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Summary>> {
    return await this.summaryService.getSummaryHistory(workspaceId, query);
  }
}
