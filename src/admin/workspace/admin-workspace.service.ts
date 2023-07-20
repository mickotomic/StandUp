import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Workspace } from 'src/entities/workspace.entity';
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
}
