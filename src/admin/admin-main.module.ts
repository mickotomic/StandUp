import { Module } from '@nestjs/common';
import { AdminSubscriptionModule } from './subscription/admin-subscription.module';
import { AdminUserModule } from './user/admin-user.module';
import { AdminWorkspaceModule } from './workspace/admin-workspace.module';

@Module({
  imports: [AdminWorkspaceModule, AdminUserModule, AdminSubscriptionModule],
})
export class AdminMainModule {}
