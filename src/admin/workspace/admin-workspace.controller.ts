import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { AdminRoleGuard } from 'src/auth/admin-role.guard';
import { Workspace } from 'src/entities/workspace.entity';
import { AdminWorkspaceService } from './admin-workspace.service';

@ApiTags('admin-workspaces')
@UseGuards(AdminRoleGuard)
@Controller('admin/workspaces')
export class AdminWorkspaceController {
  constructor(private readonly workspaceService: AdminWorkspaceService) {}

  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
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
