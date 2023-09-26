import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Workspace } from 'src/entities/workspace.entity';
import { AdminRoleGuard } from 'src/guards/admin-role.guard';
import { AdminWorkspaceService } from './admin-workspace.service';

@ApiTags('admin-workspaces')
@ApiBearerAuth()
@UseGuards(AdminRoleGuard)
@Controller('admin/workspaces')
export class AdminWorkspaceController {
  constructor(private readonly workspaceService: AdminWorkspaceService) {}

  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({ name: 'search', required: false, type: 'string' })
  @Get()
  async getWorkspaceList(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Workspace>> {
    return await this.workspaceService.getWorkspaceList(query);
  }

  @ApiParam({ name: 'id' })
  @Put('/:id')
  async controlWorkspaceStatus(@Param('id', ParseIntPipe) workspaceId: number) {
    return await this.workspaceService.controlWorkspaceStatus(workspaceId);
  }
}
