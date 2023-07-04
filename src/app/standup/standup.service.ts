import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Summary } from 'src/entities/summary.entity';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { User } from 'src/entities/user.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { Repository } from 'typeorm';

@Injectable()
export class StandupService {
  constructor(
    @InjectRepository(Summary)
    private readonly summaryRepository: Repository<Summary>,
    @InjectRepository(UserWorkspace)
    private userworkspaceRepository: Repository<UserWorkspace>,
  ) {}

  async next(workspaceId: number, direction: string, user: User) {
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
    if (direction === 'next') {
      const lastMember = summary.users.slice(-1)[0];
      if (lastMember === summary.currentUser) {
        return { userId: summary.currentUser, isLastMember: true };
      } else {
        const currentUser =
          summary.users[summary.users.indexOf(summary.currentUser) + 1];
        summary.currentUser = currentUser;
        this.summaryRepository.update(summary.id, summary);
        return {
          userId: summary.currentUser,
          isLastMember: lastMember === currentUser,
        };
      }
    } else if (direction === 'previous') {
      const firstMember = summary.users[0];
      if (firstMember === summary.currentUser) {
        return { userId: summary.currentUser, isFirstMember: false };
      } else {
        const currentUser =
          summary.users[summary.users.indexOf(summary.currentUser) - 1];
        summary.currentUser = currentUser;
        this.summaryRepository.update(summary.id, summary);
        return { userId: summary.currentUser, isLastMember: false };
      }
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
