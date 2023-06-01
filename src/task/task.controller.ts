import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from 'src/entities/task.entity';
import { ApiQuery } from '@nestjs/swagger';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiQuery({ name: 'workspaceId' })
  @ApiQuery({ name: 'userId' })
  @ApiQuery({ name: 'isForCurrentUserOnly' })
  async getDefaultTaskList(
    @Query('workspaceId') workspaceId: number,
    @Query('isForCurrentUserOnly') isForCurrentUserOnly: boolean,
  ): Promise<{ tasks: Task[] }> {
    return await this.taskService.getDefaultTaskList(
      workspaceId,
      1,
      isForCurrentUserOnly,
    );
  }

  @Get()
  async getSingleTask(@Param('userId', ParseIntPipe) userId: number) {
    return await this.taskService.getSingleTask(userId);
  }

  @Put()
  async updateTask(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateTaskDto,
  ) {
    return await this.taskService.updateTask(userId, dto);
  }

  @Delete()
  @HttpCode(204)
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return await this.taskService.deleteTask(id, user);
  }
}
