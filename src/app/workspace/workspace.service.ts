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
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { isEmail } from 'src/helpers/is-email.helper';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';

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
  ): Promise<{ status: string; email: string }[]> {
    const invalidEmails: { status: string; email: string }[] = [];

    if (!invitedEmails.emails) {
      throw new BadRequestException(returnMessages.EmailsNotValid);
    }
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

    for (let email of arrOfEmails) {
      email = email.trim();
      const userWorkspace = await this.userWorkspaceRepository.findOneBy({
        workspace: { id: workspace.id },
        user: { email: email },
      });
      if (userWorkspace) {
        invalidEmails.push({
          status: returnMessages.UserExistsInWorkspace,
          email: email,
        });
      } else if (!isEmail(email)) {
        invalidEmails.push({
          status: returnMessages.EmailsNotValid,
          email: email,
        });
      } else {
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
            attempts: +process.env.QUEUES_NUMBER_OF_ATTEMPTS,
            backoff: {
              type: process.env.QUEUES_BACKOFF_TYPE,
              delay: +process.env.QUEUES_BACKOFF_DELAY,
            },
          },
        );
      }
    }
    return invalidEmails;
  }

  public async verifyInvitation(
    verifyTokenDto: VerifyTokenDto,
    user: User,
  ): Promise<{
    message: string;
    workspace: Pick<Workspace, 'id' | 'projectName'>;
  }> {
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
        isValid: true,
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

    return {
      message: returnMessages.TokenIsValid,
      workspace: { id: workspace.id, projectName: workspace.projectName },
    };
  }

  public async checkDoesEmailExists(
    email: string,
  ): Promise<{ userExists: boolean }> {
    const user = await this.userRepository.findOneBy({ email });
    return { userExists: !!user };
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

  async findAllWorkspaces(
    user: User,
    withDeleted: string,
  ): Promise<{ workspaces: Workspace[]; count: number }> {
    const qb = this.workspaceRepository
      .createQueryBuilder('workspaces')
      .leftJoin('workspaces.owner', 'owner')
      .leftJoin('workspaces.users', 'users_workspaces')
      .where('workspaces.isActive = :isActive', { isActive: true });

    if (withDeleted === 'true') {
      qb.withDeleted().andWhere(
        'workspaces.deletedAt IS NOT NULL AND owner.id = :ownerId',
        { ownerId: user.id },
      );
    }
    if (withDeleted === 'false') {
      qb.withDeleted().andWhere(
        'workspaces.deletedAt IS NULL AND owner.id = :ownerId',
        { ownerId: user.id },
      );
    }
    if (withDeleted !== 'true' && withDeleted !== 'false') {
      throw new BadRequestException(returnMessages.BooleanValueExpected);
    }

    qb.orWhere(
      'workspaces.deletedAt IS NULL AND users_workspaces.user = :userId AND workspaces.isActive = :isActive',
      { userId: user.id, isActive: true },
    );
    const [workspaces, count] = await qb.getManyAndCount();
    return { workspaces, count };
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

    return await this.workspaceRepository.save({
      ...workspace,
      projectName: updateWorkspaceDto.projectName,
      settings: updateWorkspaceDto.settings,
    });
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

  async restoreWorkspace(id: number, user: User): Promise<Workspace> {
    const workspace = await this.workspaceRepository
      .createQueryBuilder('workspaces')
      .leftJoin('workspaces.owner', 'owner')
      .withDeleted()
      .where('workspaces.id = :id', { id })
      .andWhere('owner.id = :ownerId', { ownerId: user.id })
      .getOne();

    if (!workspace) {
      throw new NotFoundException(returnMessages.WorkspaceNotFound);
    }

    if (workspace.deletedAt === null) {
      throw new BadRequestException(returnMessages.WorkspaceNotDeleted);
    }

    await this.workspaceRepository
      .createQueryBuilder('workspaces')
      .restore()
      .where('workspaces.id = :id', { id })
      .execute();

    return await this.workspaceRepository.findOneBy({ id });
  }
}
