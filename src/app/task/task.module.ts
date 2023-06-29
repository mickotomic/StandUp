import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, UserWorkspace])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
