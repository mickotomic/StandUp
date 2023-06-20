import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { Repository } from 'typeorm';
import { TaskDto } from './dto/task.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getDefaultTaskList(
    workspaceId: number,
    user: User,
    isForCurrentUserOnly = false,
  ): Promise<{ tasks: Task[]; count: number }> {
    const qb = this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.user', 'user')
      .select('*')
      .where('tasks.summary = :summary', { summary: null })
      .andWhere('tasks.workspace = :workspaceId', { workspaceId });
    if (isForCurrentUserOnly) {
      qb.andWhere('tasks.user = :userId', { user });
    }

    const [tasks, count] = await qb.getManyAndCount();
    return { tasks, count };
  }

  async createTask(user: User, dto: TaskDto): Promise<Task> {
    return await this.taskRepository.save({
      user,
      name: dto.name,
      status: dto.status,
      workspaceId: dto.workspaceId,
      deadline: dto.deadline,
    });
  }

  async updateTask(id: number, user: User, dto: TaskDto) {
    const task = await this.taskRepository.findOneBy({ id, user });
    if (!task) {
      throw new BadRequestException('Task not found!');
    }

    task.name = dto.name;
    task.priority = dto.priority;
    task.status = dto.status;
    task.deadline = dto.deadline;

    return await this.taskRepository.save(task);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const task = await this.taskRepository.findOneBy({ id, user });
    if (!task) {
      throw new BadRequestException('Task not found!');
    }
    await this.taskRepository.delete(task);
  }
}
