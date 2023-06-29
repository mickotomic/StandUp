import { Module } from '@nestjs/common';
import { TaskModule } from 'src/app/task/task.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [WorkspaceModule, TaskModule],
})
export class MainModule {}
