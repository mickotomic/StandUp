import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Summary } from 'src/entities/summary.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SummaryService {
  constructor(
    @InjectRepository(Summary)
    private summaryRepository: Repository<Summary>,
  ) {}

  async getSummaryHistory(
    workspaceId: number,
    query: PaginateQuery,
  ): Promise<Paginated<Summary>> {
    const PaginateConfig: PaginateConfig<Summary> = {
      defaultLimit: 50,
      sortableColumns: ['id'],
      relations: ['workspace', 'tasks'],
      defaultSortBy: [['id', 'DESC']],
      select: [
        'id',
        'tasksDue',
        'tasksCompleted',
        'absentUsers',
        'createdAt',
        'finishedAt',
      ],
    };
    const qb = this.summaryRepository
      .createQueryBuilder('summaries')
      .leftJoinAndSelect('summaries.workspace', 'workspace')
      .where('summaries.workspace = :workspaceId', { workspaceId });
    return await paginate<Summary>(query, qb, PaginateConfig);
  }
}
