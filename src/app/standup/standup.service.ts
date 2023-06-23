import { InjectQueue } from '@nestjs/bull';
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
      where: { workspaces: { workspace: { id: workspaceId } }},
      relations: ['tasks']
    })
    // tasks: {summary: null} 
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

  // public async inviteUsers(
  //   worksapceId: number,
  //   invitedEmails: { emails: string },
  //   user: User,
  // ): Promise<void> {
  //   const workspace = await this.workspaceRepository.findOne({
  //     where: { id: worksapceId },
  //     relations: { owner: true },
  //   });
  //   if (!workspace) {
  //     throw new NotFoundException(returnMessages.WorkspaceNotFound);
  //   }
  //   if (workspace.owner.id !== user.id) {
  //     throw new UnauthorizedException(returnMessages.WorkspaceOwnerInvite);
  //   }
  //   const arrOfEmails = invitedEmails.emails.split(',');

  //   arrOfEmails.forEach(async (email) => {
  //     this.userTokenRepository.update(
  //       { userEmail: email, workspace: { id: workspace.id }, isValid: true },
  //       { isValid: false },
  //     );
  //     const token = uuidv4();
  //     const link =
  //       process.env.BASE_URL +
  //       process.env.APP_PORT +
  //       `/app/workspaces/verify?workspaceId=${worksapceId}&token=${token}&email=${email}`;

  //     this.userTokenRepository.save({
  //       userEmail: email,
  //       workspace: { id: workspace.id },
  //       token,
  //     });

  //     await this.mailerQueue.add(
  //       'inviteEmail',
  //       {
  //         email,
  //         link,
  //         name: user.name,
  //         workspaceName: workspace.projectName,
  //       },
  //       {
  //         attempts: 5,
  //       },
  //     );
  //   });
  // }

  // public async verifyInvitation(
  //   verifyTokenDto: VerifyTokenDto,
  //   user: User,
  // ): Promise<{ message: string; workspace: Workspace }> {
  //   const workspace = await this.workspaceRepository.findOneBy({
  //     id: verifyTokenDto.workspaceId,
  //   });
  //   if (!workspace) {
  //     throw new BadRequestException(returnMessages.WorkspaceNotFound);
  //   }

  //   const userToken = await this.userTokenRepository.findOne({
  //     where: {
  //       token: verifyTokenDto.token,
  //       userEmail: verifyTokenDto.email,
  //       workspace: { id: verifyTokenDto.workspaceId },
  //     },
  //   });
  //   if (!userToken || userToken.userEmail !== user.email) {
  //     throw new BadRequestException(returnMessages.TokenNotValid);
  //   }

  //   this.userTokenRepository.update(userToken.id, { isValid: false });
  //   await this.userWorkspaceRepository.save({
  //     workspace: { id: verifyTokenDto.workspaceId },
  //     user,
  //   });

  //   return { message: returnMessages.TokenIsValid, workspace };
  // }

  // public async checkDoesEmailExists(
  //   email: string,
  // ): Promise<{ userExists: boolean }> {
  //   const user = await this.userRepository.findOneBy({ email });
  //   return { userExists: user ? true : false };
  // }
}
