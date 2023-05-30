import { Module } from '@nestjs/common';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [WorkspaceModule],
})
export class MainModule {}
