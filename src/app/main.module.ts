import { Module } from '@nestjs/common';
import { TaskModule } from 'src/app/task/task.module';
import { StandupModule } from './standup/standup.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [WorkspaceModule, StandupModule, TaskModule],
})
export class MainModule {}
