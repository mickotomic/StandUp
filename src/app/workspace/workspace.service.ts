import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { UserToken } from 'src/entities/user-token.entity';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    @InjectRepository(UserWorkspace)
    private readonly userWorkspaceRepository: Repository<UserWorkspace>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectQueue('workspace') private readonly mailerQueue: Queue,
  ) {}

  public async inviteUsers(
    worksapceId: number,
    invitedEmails: { emails: string },
    user: User,
  ): Promise<void> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: worksapceId },
      relations: { owner: true },
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    if (workspace.owner.id !== user.id) {
      throw new UnauthorizedException('Only workspace owners can invite users');
    }
    const arrOfEmails = invitedEmails.emails.split(',');

    arrOfEmails.forEach(async (email) => {
      const oldUserTokens = await this.userTokenRepository.find({
        where: {
          userEmail: email,
          workspace: { id: workspace.id },
          isValid: true,
        },
      });
      if (oldUserTokens) {
        oldUserTokens.forEach((userToken) => {
          this.userTokenRepository.update(userToken.id, { isValid: false });
        });
      }
      const token = uuidv4();
      const link =
        process.env.BASE_URL +
        process.env.APP_PORT +
        `/app/workspaces/verify?workspaceId=${worksapceId}&token=${token}&email=${email}`;

      this.userTokenRepository.save({
        userEmail: email,
        workspace: { id: workspace.id },
        token,
      });

      await this.mailerQueue.add(
        'inviteEmail',
        {
          email,
          link,
          name: user.name,
          workspaceName: workspace.projectName,
        },
        {
          attempts: 5,
        },
      );
    });
  }

  public async verifyInvitation(
    workspaceId: number,
    email: string,
    token: string,
    user: User,
  ): Promise<{ message: string; workspace: Workspace }> {
    const workspace = await this.workspaceRepository.findOneBy({
      id: workspaceId,
    });
    if (!workspace) {
      throw new BadRequestException('Workspace not found');
    }

    const userToken = await this.userTokenRepository.findOne({
      where: { token, userEmail: email, workspace: { id: workspaceId } },
    });
    if (!userToken || userToken.userEmail !== user.email) {
      throw new BadRequestException('Token is not valid');
    }

    this.userTokenRepository.update(userToken.id, { isValid: false });
    await this.userWorkspaceRepository.save({
      workspace: { id: workspaceId },
      user,
    });

    return { message: 'Token is valid', workspace };
  }

  public async checkDoesEmailExists(
    email: string,
  ): Promise<{ userExists: boolean }> {
    const user = await this.userRepository.findOneBy({ email });
    return { userExists: user ? true : false };
  }
}
