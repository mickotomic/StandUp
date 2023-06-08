import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from 'src/entities/task.entity';
import { ApiQuery } from '@nestjs/swagger';
import { TaskDto } from './dto/task.dto';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiQuery({ name: 'workspaceId' })
  @ApiQuery({ name: 'isForCurrentUserOnly' })
  async getDefaultTaskList(
    @Query('workspaceId') workspaceId: number,
    @Query('isForCurrentUserOnly') isForCurrentUserOnly: boolean,
    @GetUser() user: User,
  ): Promise<{ tasks: Task[] }> {
    return await this.taskService.getDefaultTaskList(
      workspaceId,
      user,
      isForCurrentUserOnly,
    );
  }

  @Post()
  async createTask(@GetUser() user: User, @Body() dto: TaskDto): Promise<Task> {
    return await this.taskService.createTask(user, dto);
  }

  @Put()
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TaskDto,
  ) {
    return await this.taskService.updateTask(id, dto);
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
