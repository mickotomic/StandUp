import { Module } from '@nestjs/common';
import { WorkspaceModule } from './workspace/workspace.module';
import { StandupModule } from './standup/standup.module';

@Module({
  imports: [WorkspaceModule, StandupModule ],
})
export class MainModule {}
