import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Workspace } from 'src/entities/workspace.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { Repository } from 'typeorm';

@Injectable()
export class AdminWorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
  ) {}

  async getWorkspaceList(query: PaginateQuery): Promise<Paginated<Workspace>> {
    const paginateConfig: PaginateConfig<Workspace> = {
      defaultLimit: 50,
      sortableColumns: [],
      relations: ['owner'],
      defaultSortBy: [['id', 'DESC']],
      select: ['id', 'name'],
      searchableColumns: ['projectName'],
    };
    const qb = this.workspaceRepository
      .createQueryBuilder('workspaces')
      .leftJoinAndSelect('workspaces.owner', 'owner');
    return await paginate(query, qb, paginateConfig);
  }

  async controlWorkspaceStatus(
    workspaceId: number,
  ): Promise<{ isActive: boolean }> {
    const workspace = await this.workspaceRepository.findOne({
      where: {
        id: workspaceId,
      },
      withDeleted: true,
    });

    if (!workspace) {
      throw new BadRequestException(returnMessages.WorkspaceNotFound);
    }

    await this.workspaceRepository.save({
      ...workspace,
      isActive: !workspace.isActive,
      deletedAt: workspace.isActive ? new Date() : null,
    });

    return workspace;
  }
}
