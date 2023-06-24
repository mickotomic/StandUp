import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { UserWorkspace } from 'src/entities/user-workspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, UserWorkspace])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
