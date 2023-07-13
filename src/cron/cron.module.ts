import { Module } from '@nestjs/common';
import { SubscriptionModule } from './subscription/supscriptions.module';

@Module({
  imports: [SubscriptionModule],
})
export class CronModule {}
