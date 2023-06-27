import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Summary } from 'src/entities/summary.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { shuffle } from 'src/helpers/shuffle.helper';
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

  async startStandup(workspaceId: number) {
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

  async finishStandup(workspaceId: number) {
    const existingStartedStandup = await this.summaryRepository
      .createQueryBuilder('summary')
      .where('summary.workspace = :workspaceId', { workspaceId })
      .andWhere('summary.startedAt IS NOT NULL')
      .andWhere('summary.finishedAt IS NULL')
      .getOne();

    if (!existingStartedStandup) {
      throw new BadRequestException(returnMessages.NoStandupForWorkspace);
    }

    const timeSpentMilliseconds =
      new Date().getTime() - existingStartedStandup.startedAt.getTime();
    const timeSpentSeconds = Math.floor(timeSpentMilliseconds / 1000);
    const minutes = Math.floor(timeSpentSeconds / 60);
    const seconds = timeSpentSeconds % 60;

    await this.summaryRepository.update(existingStartedStandup.id, {
      finishedAt: new Date(),
      timespent: `${minutes} minutes ${seconds} seconds`,
    });

    return { message: returnMessages.StandupFinished };
  }
}
