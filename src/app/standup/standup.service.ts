import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Summary } from 'src/entities/summary.entity';
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

    await this.summaryRepository.save({
      workspace: { id: workspace.id },
      startedAt: new Date(),
    });

    const [users, count] = await this.userRepository.findAndCount({
      where: {
        workspaces: { workspace: { id: workspaceId } },
        tasks: { summary: null },
      },
      relations: ['tasks'],
    });

    const shuffledUsers = shuffle(users);

    return { shuffledUsers, count };
  }

  async finishStandup(
    workspaceId: number,
    absentUsers: User[],
    users: User[],
  ) {
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

    const absentUsersIds = absentUsers.map((user) => user.id);
    const usersIds = users.map((user) => user.id);
 
    // let attendees = 0;
    // let absentUsers = 0;
    // for (const user of listOfUsersAndTasks) {
    //   if (user.attendees === true) {
    //     attendees += 1;
    //   } else {
    //     absentUsers += 1;
    //   }
    // }

    await this.summaryRepository.update(existingStartedStandup.id, {
      finishedAt: new Date(),
      timespent: timeSpent,
      absentUsers: absentUsersIds,
      users: usersIds,
    });

    return { message: returnMessages.StandupFinished };
  }
}
