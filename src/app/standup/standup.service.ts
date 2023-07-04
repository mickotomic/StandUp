import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Summary } from 'src/entities/summary.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StandupService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Summary)
    private readonly summaryRepository: Repository<Summary>,
  ) {}

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
