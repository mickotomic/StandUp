import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/subscription.entity';
import { AdminSubscriptionController } from './admin-subscription.controller';
import { AdminSubscriptionService } from './admin-subscription.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [AdminSubscriptionController],
  providers: [AdminSubscriptionService],
})
export class AdminSubscriptionModule {}
