import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Summary } from 'src/entities/summary.entity';
import { UserWorkspaceGuard } from 'src/guards/user-workspace.guard';
import { SummaryService } from './summary.service';

@ApiTags('app-summary')
@Controller('/app/summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiBearerAuth()
  @UseGuards(UserWorkspaceGuard)
  @Get('/:workspaceId')
  async getSummaryHistory(
    @Param('workspaceId') workspaceId: number,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Summary>> {
    return await this.summaryService.getSummaryHistory(workspaceId, query);
  }
}
