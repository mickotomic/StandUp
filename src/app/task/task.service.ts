import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { User } from 'src/entities/user.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { Repository } from 'typeorm';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(UserWorkspace)
    private userWorkspaceRepository: Repository<UserWorkspace>,
  ) {}

  async getDefaultTaskList(
    workspaceId: number,
    user: User,
    isForCurrentUserOnly = '',
  ): Promise<{ tasks: Task[]; count: number }> {
    const qb = this.taskRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.user', 'user')
      .where('tasks.summary IS NULL')
      .andWhere('tasks.workspace = :workspaceId', { workspaceId });
    if (isForCurrentUserOnly === 'true') {
      qb.andWhere('tasks.user = :userId', { userId: user.id });
    }

    const [tasks, count] = await qb.getManyAndCount();
    return { tasks, count };
  }

  async createTask(user: User, dto: TaskDto): Promise<Task> {
    const workspace = await this.userWorkspaceRepository.findOne({
      where: { user: { id: user.id }, workspace: { id: dto.workspaceId } },
    });

    if (!workspace) {
      throw new BadRequestException(returnMessages.UserDoesNotBelong);
    }

    return await this.taskRepository.save({
      user,
      name: dto.name,
      priority: dto.priority,
      status: dto.status,
      workspace: { id: dto.workspaceId },
      deadline: dto.deadline,
    });
  }

  async updateTask(id: number, user: User, dto: TaskDto) {
    const task = await this.taskRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!task) {
      throw new BadRequestException(returnMessages.TaskNotFound);
    }

    task.name = dto.name;
    task.priority = dto.priority;
    task.status = dto.status;
    task.deadline = dto.deadline;
    return await this.taskRepository.save(task);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const task = await this.taskRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!task) {
      throw new BadRequestException(returnMessages.TaskNotFound);
    }
    await this.taskRepository.remove(task);
  }
}
