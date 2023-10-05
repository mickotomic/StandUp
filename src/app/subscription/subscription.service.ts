import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Subscription } from 'src/entities/subscription.entity';
import { User } from 'src/entities/user.entity';
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
    user: User,
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
      .leftJoin('workspace.owner', 'owner')
      .where('workspace.id = :workspaceId', { workspaceId })
      .andWhere('owner.id = :ownerId', { ownerId: user.id });
    return await paginate<Subscription>(query, qb, paginateConfig);
  }
}
