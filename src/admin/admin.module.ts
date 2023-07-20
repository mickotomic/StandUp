import { Module } from '@nestjs/common';
import { AdminWorkspaceModule } from './admin-main.module';
import { AdminUserModule } from './user/admin-user.module';

@Module({
  imports: [AdminUserModule, AdminWorkspaceModule],
})
export class AdminModule {}
