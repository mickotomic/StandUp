import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { Summary } from 'src/entities/summary.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';

@Injectable()
export class StandupService {
  constructor(
    @InjectRepository(Summary)
    private summaryRepository: Repository<Summary>,
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
}
