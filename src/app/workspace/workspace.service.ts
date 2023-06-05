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
import { VerifyTokenDto } from './dto/verify-token.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

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
    workspaceId: number,
    invitedEmails: { emails: string },
    user: User,
  ): Promise<void> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },  
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
      this.userTokenRepository.update(
        { userEmail: email, workspace: { id: workspace.id }, isValid: true },
        { isValid: false },
      );
      const token = uuidv4();
      const link =
        process.env.BASE_URL +
        process.env.APP_PORT +
        `/app/workspaces/verify?workspaceId=${workspaceId}&token=${token}&email=${email}`;

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
    verifyTokenDto: VerifyTokenDto,
    user: User,
  ): Promise<{ message: string; workspace: Workspace }> {
    const workspace = await this.workspaceRepository.findOneBy({
      id: verifyTokenDto.workspaceId,
    });
    if (!workspace) {
      throw new BadRequestException('Workspace not found');
    }

    const userToken = await this.userTokenRepository.findOne({
      where: {
        token: verifyTokenDto.token,
        userEmail: verifyTokenDto.email,
        workspace: { id: verifyTokenDto.workspaceId },
      },
    });
    if (!userToken || userToken.userEmail !== user.email) {
      throw new BadRequestException('Token is not valid');
    }

    this.userTokenRepository.update(userToken.id, { isValid: false });
    await this.userWorkspaceRepository.save({
      workspace: { id: verifyTokenDto.workspaceId },
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
  
  public async createWorkspace(createWorkspaceDto: CreateWorkspaceDto, user: User ):
  Promise<{projectName: string, settings: string, ownerId: number}> {
    const workspace = { ...createWorkspaceDto, ownerId: user.id};
    // const workspace = this.workspaceRepository.create(createWorkspaceDto);
    return this.workspaceRepository.save(workspace);
  }


  async findAllWorkspaces(): Promise<Workspace[]> {
    return await this.workspaceRepository.find();
  }

  async findOneWorkspace(id: number): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOneBy({ id });
    if ( workspace.deletedAt === null ) {
      throw new Error('Workspace with id ' + { id } + ' was deleted');
    } else if (!workspace) {
      throw new Error('Workspace not found');
    }
    return workspace;
  }

  async updateWorkspace(id: number, updateWorkspaceDto: CreateWorkspaceDto) {
    return await this.workspaceRepository.update(id, updateWorkspaceDto);
   
  }

  async removeWorkspace(id: number) {
      return await this.workspaceRepository
      .createQueryBuilder('ws')
      .softDelete()
      .where('id = :id', { id })
      .execute();
  }

  async restoreWorkspace(id: number) {
    return await this.workspaceRepository
      .createQueryBuilder('ws-restore')
      .restore()
      .where('id = :id', { id })
      .execute();
  }

}
