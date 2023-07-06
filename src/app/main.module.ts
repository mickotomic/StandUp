import { Module } from '@nestjs/common';
import { WorkspaceModule } from './workspace/workspace.module';
import { TaskModule } from 'src/app/task/task.module';
import { SummaryModule } from './summary/summary.module';

@Module({
  imports: [WorkspaceModule, TaskModule, SummaryModule],
})
export class MainModule {}
