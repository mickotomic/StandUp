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
import { Repository, createQueryBuilder } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';

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
      throw new NotFoundException(returnMessages.WorkspaceNotFound);
    }
    if (workspace.owner.id !== user.id) {
      throw new UnauthorizedException(returnMessages.WorkspaceOwnerInvite);
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
      throw new BadRequestException(returnMessages.WorkspaceNotFound);
    }

    const userToken = await this.userTokenRepository.findOne({
      where: {
        token: verifyTokenDto.token,
        userEmail: verifyTokenDto.email,
        workspace: { id: verifyTokenDto.workspaceId },
      },
    });
    if (!userToken || userToken.userEmail !== user.email) {
      throw new BadRequestException(returnMessages.TokenNotValid);
    }

    this.userTokenRepository.update(userToken.id, { isValid: false });
    await this.userWorkspaceRepository.save({
      workspace: { id: verifyTokenDto.workspaceId },
      user,
    });

    return { message: returnMessages.TokenIsValid, workspace };
  }

  public async checkDoesEmailExists(
    email: string,
  ): Promise<{ userExists: boolean }> {
    const user = await this.userRepository.findOneBy({ email });
    return { userExists: user ? true : false };
  }

  public async createWorkspace(
    createWorkspaceDto: CreateWorkspaceDto,
    owner: User,
  ): Promise<Workspace> {
    const workspace = await this.workspaceRepository.save({
      ...createWorkspaceDto,
      owner,
    });
    await this.userWorkspaceRepository.save({
      workspace: { id: workspace.id },
      user: owner,
    });
    return workspace;
  }

  async findAllWorkspaces(user: User, withDeleted: string): Promise<any> {
    const qb = this.workspaceRepository
      .createQueryBuilder('workspaces')
      .leftJoin('workspaces.owner', 'owner')
      .leftJoin('workspaces.users', 'users_workspaces');

    if (withDeleted === 'true') {
      qb.withDeleted().where(
        'workspaces.deletedAt IS NOT NULL AND owner.id = :ownerId',
        { ownerId: user.id },
      );
    }
    qb.orWhere(
      'workspaces.deletedAt IS NULL AND users_workspaces.user = :userId',
      { userId: user.id },
    );
    return await qb.getManyAndCount();
  }

  async updateWorkspace(
    id: number,
    updateWorkspaceDto: CreateWorkspaceDto,
    user: User,
  ) {
    const workspace = await this.workspaceRepository
      .createQueryBuilder('workspaces')
      .leftJoin('workspaces.owner', 'owner')
      .where({ id, owner: user.id })
      .getOne();

    if (!workspace) {
      throw new BadRequestException(returnMessages.WorkspaceNotFound);
    }

    await this.workspaceRepository.save({
      ...workspace,
      projectName: updateWorkspaceDto.projectName,
      settings: updateWorkspaceDto.settings,
    });
    return workspace;
  }

  async removeWorkspace(id: number, user: User) {
    return await this.workspaceRepository
      .createQueryBuilder('workspaces')
      .leftJoin('workspaces.owner', 'owner')
      .softDelete()
      .where('workspaces.id = :id', { id })
      .andWhere('owner.id = :ownerId', { ownerId: user.id })
      .execute();
  }

  async restoreWorkspace(id: number, user: User) {
    return await this.workspaceRepository
      .createQueryBuilder('workspaces')
      .leftJoin('workspaces.owner', 'owner')
      .withDeleted()
      .restore()
      .where('workspaces.id = :id', { id })
      .andWhere('owner.id = :ownerId', { ownerId: user.id })
      .execute();
  }
}
