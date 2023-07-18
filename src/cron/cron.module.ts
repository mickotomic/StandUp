import { Module } from '@nestjs/common';
import { CronSubscriptionModule } from './subscription/cron-supscriptions.module';

@Module({
  imports: [CronSubscriptionModule],
})
export class CronModule {}
