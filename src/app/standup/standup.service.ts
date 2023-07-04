
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { Summary } from 'src/entities/summary.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { User } from 'src/entities/user.entity';


@Injectable()
export class StandupService {
  constructor(
    @InjectRepository(Summary)

    private readonly summaryRepository: Repository<Summary>,
    @InjectRepository(UserWorkspace)
    private userworkspaceRepository: Repository<UserWorkspace>,
  ) {}

    async next(
      workspaceId: number,
      direction: string,
    ) {
      const summary = await this.summaryRepository.findOneBy ({
      workspace: { id: workspaceId},
      startedAt: Not(null), finishedAt: null })

      if (!summary){ throw new BadRequestException(returnMessages.SummaryNotFound)}


      

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
