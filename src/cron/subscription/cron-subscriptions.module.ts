import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionItems } from 'src/entities/subscription-items.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { CronSubscriptionProcess } from './cron-subscription.process';
import { CronSubscriptionService } from './cron-subscription.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Workspace, Subscription, SubscriptionItems]),
    BullModule.registerQueue({
      limiter: {
        max: +process.env.QUEUES_LIMITER_MAX,
        duration: +process.env.QUEUES_LIMITER_DURATION,
      },
      name: 'invoice-email',
    }),
  ],
  providers: [CronSubscriptionService, CronSubscriptionProcess],
})
export class CronSubscriptionModule {}
