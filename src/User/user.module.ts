import { Module } from '@nestjs/common';
import { WorkspaceModule } from './Workspace/workspace.module';

@Module({
  imports: [WorkspaceModule],
})
export class UserModule {}
