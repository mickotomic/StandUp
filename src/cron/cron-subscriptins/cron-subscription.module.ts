import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/subscription.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { CronSubscriptionService } from './cron-subscription.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Workspace])],
  providers: [CronSubscriptionService],
})
export class CronSubscriptionsModule {}
