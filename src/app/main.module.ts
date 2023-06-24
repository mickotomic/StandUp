import { Module } from '@nestjs/common';
import { WorkspaceModule } from './workspace/workspace.module';
import { TaskModule } from 'src/app/task/task.module';
import { StandupModule } from './standup/standup.module';

@Module({
  imports: [WorkspaceModule, StandupModule, TaskModule ],
})
export class MainModule {}
