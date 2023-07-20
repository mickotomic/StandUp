import { Module } from '@nestjs/common';
import { CronSubscriptionsModule } from './cron-subscriptins/cron-subscription.module';

@Module({
  imports: [CronSubscriptionsModule],
})
export class CronModule {}
