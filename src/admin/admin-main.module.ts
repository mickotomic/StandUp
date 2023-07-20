import { Module } from '@nestjs/common';
import { AdminUserModule } from './user/admin-user.module';
import { AdminWorkspaceModule } from './workspace/admin-workspace.module';

@Module({ imports: [AdminWorkspaceModule, AdminUserModule] })
export class AdminMainModule {}
