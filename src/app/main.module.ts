import { Module } from '@nestjs/common';
import { WorkspaceModule } from './workspace/workspace.module';
import { TaskModule } from 'src/app/task/task.module';

@Module({
  imports: [WorkspaceModule, TaskModule],
})
export class MainModule {}
