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

  @Cron('0 * * * * *')
  async checkWorkspaceSubscription() {
    let pricePerUser = 0;
    const workspaces = await this.workspaceRepository.find({
      where: { isActive: true },
      relations: { owner: true, subscriptions: true, users: true },
    });

    workspaces.forEach(async (workspace) => {
      if (workspace.subscriptions.length > 0 && workspace.users.length > 4) {
        const subscription =
          workspace.subscriptions[workspace.subscriptions.length - 1];
        if (subscription.status === 'paid') {
          if (
            getDateDifference(new Date(), subscription.createdAt) > 30 &&
            new Date().getMonth() !== subscription.createdAt.getMonth()
          ) {
            pricePerUser = calculateSubscriptionPrice(workspace.users.length);
          }
        }
      } else if (workspace.users.length > 4) {
        if (getDateDifference(new Date(), workspace.createdAt) > 30) {
          pricePerUser = calculateSubscriptionPrice(workspace.users.length);
        }
      }
      if (pricePerUser > 0) {
        const subscription = await this.subscriptionRepository.save({
          workspace: { id: workspace.id },
          numberOfActiveUsers: workspace.users.length,
          price: pricePerUser * workspace.users.length,
        });
        this.subscriptionItemsRepository.save({
          price: pricePerUser,
          subscription: { id: subscription.id },
          user: { id: workspace.owner.id },
        });
      }
    });
  }
}
