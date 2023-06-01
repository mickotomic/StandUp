import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { formatDate } from 'src/helpers/date-and-time.helper';
import { Repository } from 'typeorm';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getDefaultTaskList(
    workspaceId: number,
    userId: number,
    isForCurrentUserOnly = false,
  ): Promise<{ tasks: Task[]; count: number }> {
    const qb = this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.user', 'user')
      .select('*')
      .where('tasks.createdAt like :currentDate', {
        currentDate: formatDate() + '%',
      })
      .andWhere('tasks.workspace = :workspaceId', { workspaceId });
    if (isForCurrentUserOnly) {
      qb.andWhere('tasks.user = :userId', { userId });
    }

    const [tasks, count] = await qb.getManyAndCount();
    return { tasks, count };
  }

  async getSingleTask(userId: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id: userId });

    if (!task) {
      throw new BadRequestException('Task not found!');
    }
    return task;
  }

  async updateTask(userId: number, dto: UpdateTaskDto) {
    return await this.taskRepository.update(userId, dto);
  }

  @HttpCode(204)
  async deleteTask(id: number, @GetUser() user: User): Promise<void> {
    const task = await this.taskRepository.findOneBy({ id, user });
    if (!task) {
      throw new BadRequestException('Task not found!');
    }
    await this.taskRepository.delete(task);
  }
}