import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Summary } from 'src/entities/summary.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { shuffle } from 'src/helpers/shuffle.helper';
import { UsersWidthTasksT } from 'src/types/user-width-tasks.type';
import { Repository } from 'typeorm';
import { StandupDto } from './dto/standup.dto';

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

    const shuffledUsers = shuffle(users);

    const usersIds = shuffledUsers.map((user) => {
      delete user.password;
      return user.id;
    });

    await this.summaryRepository.save({
      workspace: { id: workspace.id },
      startedAt: new Date(),
      users: usersIds,
      currentUser: shuffledUsers[0].id,
    });

    return { shuffledUsers, count };
  }

  async finishStandup(workspaceId: number, standupDto: StandupDto) {
    const existingStartedStandup = await this.summaryRepository
      .createQueryBuilder('summary')
      .where('summary.workspace = :workspaceId', { workspaceId })
      .andWhere('summary.startedAt IS NOT NULL')
      .andWhere('summary.finishedAt IS NULL')
      .getOne();

    if (!existingStartedStandup) {
      throw new BadRequestException(returnMessages.NoStandupForWorkspace);
    }
    if (standupDto.isPrevUserPresent) {
      existingStartedStandup.attendees.push(existingStartedStandup.currentUser);
    } else {
      existingStartedStandup.absentUsers.push(
        existingStartedStandup.currentUser,
      );
    }

    const timeSpent =
      new Date().getTime() - existingStartedStandup.startedAt.getTime();

    await this.tasksRepository.query(
      'UPDATE tasks SET summaryId = ? WHERE workspaceId = ?',
      [existingStartedStandup.id, workspaceId],
    );

    const tasks = await this.tasksRepository.findBy({
      summary: { id: existingStartedStandup.id },
    });

    if (!tasks) {
      throw new BadRequestException(returnMessages.TaskNotFound);
    }

    const tasksCompleted = [];
    const tasksDue = [];
    const tasksPastDue = [];

    tasks.forEach((task) => {
      const deadline = new Date(task.deadline).getDate();
      const date = new Date(existingStartedStandup.startedAt).getDate();

      if (task.status === 'done') {
        tasksCompleted.push(task.id);
      }

      if (deadline === date && task.status !== 'done') {
        tasksDue.push(task.id);
      }

      if (deadline < date && task.status !== 'done') tasksPastDue.push(task.id);
    });

    await this.summaryRepository.update(existingStartedStandup.id, {
      finishedAt: new Date(),
      timespent: timeSpent,
      absentUsers: existingStartedStandup.absentUsers,
      attendees: existingStartedStandup.attendees,
      tasksCompleted,
      tasksDue,
      tasksPastDue,
    });

    return { message: returnMessages.StandupFinished };
  }

  async next(workspaceId: number, standupDto: StandupDto, user: User) {
    const summary = await this.summaryRepository
      .createQueryBuilder('summary')
      .where('summary.workspace = :workspaceId', { workspaceId })
      .andWhere('summary.startedAt IS NOT NULL')
      .andWhere('summary.finishedAt IS NULL')
      .getOne();

    if (!summary) {
      throw new BadRequestException(returnMessages.SummaryNotFound);
    }

    if (!summary.users.includes(user.id)) {
      throw new UnauthorizedException(
        returnMessages.UserDoesNotExistsInWorkspace,
      );
    }
    if (standupDto.direction === 'next') {
      const lastMember = summary.users.slice(-1)[0];
      if (lastMember === summary.currentUser) {
        return { userId: summary.currentUser, isLastMember: true };
      }

      if (standupDto.isPrevUserPresent) {
        if (summary.attendees.indexOf(summary.currentUser) === -1) {
          summary.attendees.push(summary.currentUser);
        }
        if (summary.absentUsers.indexOf(summary.currentUser) !== -1) {
          summary.absentUsers = summary.absentUsers.filter(
            (x) => x !== summary.currentUser,
          );
        }
      } else {
        if (summary.absentUsers.indexOf(summary.currentUser) === -1) {
          summary.absentUsers.push(summary.currentUser);
        }
        if (summary.attendees.indexOf(summary.currentUser) !== -1) {
          summary.attendees = summary.attendees.filter(
            (x) => x !== summary.currentUser,
          );
        }
      }

      const nextUser =
        summary.users[summary.users.indexOf(summary.currentUser) + 1];
      summary.currentUser = nextUser;

      this.summaryRepository.update(summary.id, summary);
      return {
        userId: summary.currentUser,
        isLastMember: lastMember === nextUser,
      };
    } else if (standupDto.direction === 'previous') {
      const firstMember = summary.users[0];

      if (firstMember === summary.currentUser) {
        return { userId: summary.currentUser, isLastMember: false };
      }
      const currentUser =
        summary.users[summary.users.indexOf(summary.currentUser) - 1];
      summary.currentUser = currentUser;
      this.summaryRepository.update(summary.id, summary);
      return { userId: summary.currentUser, isLastMember: false };
    }
  }

  public async getCurrentUser(
    workspaceId: number,
    user: User,
  ): Promise<{
    userId?: number;
    isStandupInProgress: boolean;
    isLastMember: boolean;
  }> {
    const standup = await this.summaryRepository
      .createQueryBuilder('summary')
      .where('summary.workspace = :workspaceId', { workspaceId })
      .andWhere('summary.startedAt IS NOT NULL')
      .andWhere('summary.finishedAt IS NULL')
      .getOne();
    if (!standup || !standup.users.includes(user.id)) {
      return { userId: null, isStandupInProgress: false, isLastMember: false };
    }

    return {
      userId: standup.currentUser,
      isStandupInProgress: true,
      isLastMember: standup.users.pop() === standup.currentUser,
    };
  }
}
