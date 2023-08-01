import { Module } from '@nestjs/common';
import { AdminUserModule } from './user/admin-user.module';
import { AdminWorkspaceModule } from './workspace/admin-workspace.module';
import { AdminSubscriptionModule } from './subscription/admin-subscription.module';

@Module({ imports: [AdminWorkspaceModule, AdminUserModule, AdminSubscriptionModule] })
export class AdminMainModule {}
