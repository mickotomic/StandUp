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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { TaskDto } from './dto/task.dto';
import { TaskService } from './task.service';

@ApiTags('app-tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('/app/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  @ApiQuery({ name: 'workspaceId' })
  @ApiQuery({ name: 'isForCurrentUserOnly' })
  async getDefaultTaskList(
    @Query('workspaceId') workspaceId: number,
    @Query('isForCurrentUserOnly') isForCurrentUserOnly: string,
    @GetUser() user: User,
  ): Promise<{ tasks: Task[]; count: number }> {
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

  @Put('/:id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() dto: TaskDto,
  ) {
    return await this.taskService.updateTask(id, user, dto);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return await this.taskService.deleteTask(id, user);
  }
}
