import { Module } from '@nestjs/common';
import { CronSubscriptionsModule } from './cron-subscriptins/cron-subscriptions.module';

@Module({
  imports: [CronSubscriptionsModule],
})
export class CronModule {}
