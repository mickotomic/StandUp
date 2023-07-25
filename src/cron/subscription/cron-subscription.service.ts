import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionItems } from 'src/entities/subscription-items.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { Workspace } from 'src/entities/workspace.entity';
import calculateSubscriptionPrice from 'src/helpers/calculate-subscription-price.helper';
import getDateDifference from 'src/helpers/get-date-difference.helper';
import { Repository } from 'typeorm';

@Injectable()
export class CronSubscriptionService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionItems)
    private readonly subscriptionItemsRepository: Repository<SubscriptionItems>,
  ) {}

  @Cron('0 0 4 * * *')
  async checkWorkspaceSubscription() {
    const workspaces = await this.workspaceRepository.find({
      where: { isActive: true },
      relations: { owner: true, subscriptions: true, users: true },
    });

    for (let i = 0; i < workspaces.length; i++) {
      if (
        workspaces[i].users.length < 5 ||
        getDateDifference(new Date(), workspaces[i].createdAt) < 30
      ) {
        continue;
      }
      const lastSubscription =
        workspaces[i].subscriptions[workspaces[i].subscriptions.length - 1];
      if (
        lastSubscription &&
        (lastSubscription.status !== 'paid' ||
          new Date().getMonth() === lastSubscription.createdAt.getMonth())
      ) {
        continue;
      }
      const pricePerUser = calculateSubscriptionPrice(
        workspaces[i].users.length,
      );
      const subscription = await this.subscriptionRepository.save({
        workspaces: { id: workspaces[i].id },
        numberOfActiveUsers: workspaces[i].users.length,
        price: pricePerUser * workspaces[i].users.length,
      });
      this.subscriptionItemsRepository.save({
        price: pricePerUser,
        subscription: { id: subscription.id },
        user: { id: workspaces[i].owner.id },
      });
    }
  }
}
