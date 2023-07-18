import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/subscription.entity';
import { SubscriptionService } from './subscription.service';
import { Workspace } from 'src/entities/workspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Workspace])],
  providers: [SubscriptionService],
})
export class SubscriptionsModule {}
