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
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

    const [users, count] = await this.userRepository.findAndCount({
      where: {
        workspaces: { workspace: { id: workspaceId } },
        tasks: { summary: null },
      },
      relations: ['tasks'],
    });

    const shuffledUsers: User[] = shuffle(users);
    const usersId: number[] = shuffledUsers.map((user: User) => {
      delete user.password;
      return user.id;
    });

    await this.summaryRepository.save({
      workspace: { id: workspace.id },
      startedAt: new Date(),
      currentUser: shuffledUsers[0].id,
      users: usersId,
    });

    return { shuffledUsers, count };
  }

  public async getCurrentUser(
    workspaceId: number,
    user: User,
  ): Promise<{
    user?: User;
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
      return { isStandupInProgress: false, isLastMember: false };
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: standup.currentUser },
      relations: { tasks: true },
    });
    delete currentUser.password;
    return {
      user: currentUser,
      isStandupInProgress: true,
      isLastMember: standup.users.pop() === standup.currentUser,
    };
  }
}
