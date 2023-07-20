import { Module } from '@nestjs/common';
import { CronSubscriptionModule } from './subscription/cron-subscriptions.module';

@Module({
  imports: [CronSubscriptionModule],
})
export class CronModule {}
