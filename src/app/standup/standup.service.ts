import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { UserToken } from 'src/entities/user-token.entity';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { Repository } from 'typeorm';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { StandUpDto } from './dto/standup.dto';
import { Summary } from 'src/entities/summary.entity';

@Injectable()
export class StandupService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    @InjectRepository(UserWorkspace)
    private readonly userWorkspaceRepository: Repository<UserWorkspace>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Summary)
    private readonly summaryRepository: Repository<Summary>,
  ) {}

  async startStandup(workspaceId : number, user: User ) { 

      const existingStartedStandup = await this.summaryRepository.createQueryBuilder('summary')
        .where('summary.workspace = :workspaceId', { workspaceId })
        .andWhere('summary.startedAt IS NOT NULL')
        .andWhere('summary.finishedAt IS NULL')
        .getOne();
      
    if (existingStartedStandup) {
      throw new BadRequestException("Standup already in progress");
    }
    
    const workspace = await this.workspaceRepository.findOneBy({ id: workspaceId });
    await this.summaryRepository.save({ workspace, startedAt: new Date() });

    const [users, count]  = await this.userRepository.findAndCount({
      where: { workspaces: { workspace: { id: workspaceId }}, tasks: {summary: null}},
      relations: ['tasks']
    })
  console.log(users, count);
    return { users, count };
  }


  async finishStandup(workspaceId : number, user: User ) { 
    const existingStartedStandup = await this.summaryRepository.createQueryBuilder('summary')
        .where('summary.workspace = :workspaceId', { workspaceId })
        .andWhere('summary.startedAt IS NOT NULL')
        .andWhere('summary.finishedAt IS NULL')
        .getOne();
      
    if (!existingStartedStandup) {
      throw new BadRequestException("There is no started standup for this workspace");
    }
    
  }
}
