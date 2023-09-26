import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Subscription } from 'src/entities/subscription.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async getWorkspaceSubscriptions(
    workspaceId: number,
    query: PaginateQuery,
  ): Promise<Paginated<Subscription>> {
    const paginateConfig: PaginateConfig<Subscription> = {
      defaultLimit: 50,
      sortableColumns: ['id'],
      relations: [],
      defaultSortBy: [['id', 'DESC']],
    };
    const qb = this.subscriptionRepository
      .createQueryBuilder('subscriptions')
      .leftJoinAndSelect('subscriptions.workspace', 'workspace')
      .where('workspace.id = :workspaceId', { workspaceId });
    return await paginate<Subscription>(query, qb, paginateConfig);
  }
}
