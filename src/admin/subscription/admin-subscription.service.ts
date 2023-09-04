import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';
import { Subscription } from 'src/entities/subscription.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { Repository } from 'typeorm';
import { UpdateAdminSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class AdminSubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async getSubscriptionsList(
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
      .leftJoinAndSelect('workspace.owner', 'owner');
    return await paginate<Subscription>(query, qb, paginateConfig);
  }
  async updateSubscription(
    subscriptionId: number,
    updateAdminSubscriptionDto: UpdateAdminSubscriptionDto,
  ) {
    const subscription = await this.subscriptionRepository.findOneBy({
      id: subscriptionId,
    });
    if (!subscriptionId || !subscription) {
      throw new BadRequestException(returnMessages.SubscriptionNotFound);
    }

    subscription.status = updateAdminSubscriptionDto.status;
    // it would probably be more useful to return subscription
    return await this.subscriptionRepository.save(subscription);
  }
}
