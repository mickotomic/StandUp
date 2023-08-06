import { Module } from '@nestjs/common';
import { TaskModule } from 'src/app/task/task.module';
import { PaymentModule } from './payment/payment.module';
import { StandupModule } from './standup/standup.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { SummaryModule } from './summary/summary.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    WorkspaceModule,
    StandupModule,
    TaskModule,
    SummaryModule,
    SubscriptionModule,
    PaymentModule,
  ],
})
export class MainModule {}
