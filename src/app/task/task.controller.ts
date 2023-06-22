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
import { TaskService } from './task.service';
import { Task } from 'src/entities/task.entity';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TaskDto } from './dto/task.dto';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Task')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  @ApiQuery({ name: 'workspaceId' })
  @ApiQuery({ name: 'isForCurrentUserOnly' })
  async getDefaultTaskList(
    @Query('workspaceId') workspaceId: number,
    @Query('isForCurrentUserOnly') isForCurrentUserOnly: boolean,
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
