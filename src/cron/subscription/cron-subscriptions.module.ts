import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionItems } from 'src/entities/subscription-items.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { CronSubscriptionService } from './cron-subscription.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace, Subscription, SubscriptionItems]),
  ],
  providers: [CronSubscriptionService],
})
export class CronSubscriptionModule {}