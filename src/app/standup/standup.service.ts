import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Summary } from 'src/entities/summary.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { shuffle } from 'src/helpers/shuffle.helper';
import { UsersWidthTasksT } from 'src/types/user-width-tasks.type';
import { Repository } from 'typeorm';

@Injectable()
export class StandupService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Summary)
    private readonly summaryRepository: Repository<Summary>,
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async startStandup(
    workspaceId: number,
  ): Promise<{ shuffledUsers: UsersWidthTasksT[]; count: number }> {
    const existingStartedStandup = await this.summaryRepository
      .createQueryBuilder('summary')
      .where('summary.workspace = :workspaceId', { workspaceId })
      .andWhere('summary.startedAt IS NOT NULL')
      .andWhere('summary.finishedAt IS NULL')
      .getOne();

    if (existingStartedStandup) {
      throw new BadRequestException(returnMessages.StandupInProgress);
    }

    const workspace = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });

    if (!workspace) {
      throw new BadRequestException(returnMessages.WorkspaceNotFound);
    }

    const [users, count] = await this.userRepository.findAndCount({
      where: {
        workspaces: { workspace: { id: workspaceId } },
        tasks: { summary: null },
      },
      relations: ['tasks'],
    });

    if (!users) {
      throw new BadRequestException(returnMessages.UsersForWorkspaceNotFound);
    }

    const usersIds = users.map((user) => {
      delete user.password;
      return user.id;
    });

    const shuffledUsers = shuffle(users);

    await this.summaryRepository.save({
      workspace: { id: workspace.id },
      startedAt: new Date(),
      users: usersIds,
      currentUser: shuffledUsers[0].id,
    });

    return { shuffledUsers, count };
  }

  async finishStandup(workspaceId: number, absentUsers: number[]) {
    const existingStartedStandup = await this.summaryRepository
      .createQueryBuilder('summary')
      .where('summary.workspace = :workspaceId', { workspaceId })
      .andWhere('summary.startedAt IS NOT NULL')
      .andWhere('summary.finishedAt IS NULL')
      .getOne();

    if (!existingStartedStandup) {
      throw new BadRequestException(returnMessages.NoStandupForWorkspace);
    }

    const timeSpent =
      new Date().getTime() - existingStartedStandup.startedAt.getTime();

    const [users] = await this.userRepository.findAndCount({
      where: {
        workspaces: { workspace: { id: workspaceId } },
        tasks: { summary: null },
      },
    });

    const usersIds = users.map((user) => user.id);

    if (!absentUsers.every((element) => usersIds.includes(element))) {
      throw new BadRequestException(returnMessages.UsersNotInWorkspace);
    }

    const attendeesIds = usersIds.filter((id) => {
      return absentUsers.indexOf(id) === -1;
    });

    await this.tasksRepository.query(
      'UPDATE tasks SET summaryId = ? WHERE workspaceId = ?',
      [existingStartedStandup.id, workspaceId],
    );

    const tasks = await this.tasksRepository.findBy({
      summary: { id: existingStartedStandup.id },
    });

    if (!tasks) {
      throw new BadRequestException(returnMessages.TasksNotFound);
    }

    const tasksCompleted = [];
    const tasksDue = [];
    const tasksPastDue = [];

    tasks.forEach((task) => {
      const deadline = new Date(task.deadline).getDate();
      const date = new Date(existingStartedStandup.startedAt).getDate();

      if (task.status === 'done') {
        tasksCompleted.push(task.id);
      } else if (deadline === date && task.status === 'in_progress') {
        tasksDue.push(task.id);
      } else if (deadline < date && task.status === 'not_started')
        tasksPastDue.push(task.id);
    });

    await this.summaryRepository.update(existingStartedStandup.id, {
      finishedAt: new Date(),
      timespent: timeSpent,
      absentUsers: absentUsers,
      attendees: attendeesIds,
      tasksCompleted,
      tasksDue,
      tasksPastDue,
    });

    return { message: returnMessages.StandupFinished };
  }
}
