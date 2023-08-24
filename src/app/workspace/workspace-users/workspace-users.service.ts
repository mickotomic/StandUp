import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspaceUsersService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(UserWorkspace)
    private readonly userWorkspaceRepository: Repository<UserWorkspace>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getListOfUsers(workspaceId: number, user: User) {
    const userWorkspace = await this.userWorkspaceRepository
      .createQueryBuilder('user_workspaces')
      .leftJoinAndSelect('user_workspaces.user', 'user')
      .leftJoinAndSelect('user_workspaces.workspace', 'workspace')
      .where('workspace.id = :workspaceId', { workspaceId })
      .andWhere('user.id = :userId', { userId: user.id })
      .getOne();

    if (!userWorkspace || userWorkspace.user.id !== user.id) {
      throw new BadRequestException(returnMessages.WorkspaceNotFound);
    }
    const [data, count] = await this.userWorkspaceRepository
      .createQueryBuilder('user_workspaces')
      .leftJoinAndSelect('user_workspaces.user', 'user')
      .where('user_workspaces.workspace = :id', { id: workspaceId })
      .getManyAndCount();

    for (let i = 0; i < data.length; i++) {
      delete data[i].user.password;
    }
    return { data, count };
  }
  async removeUser(workspaceId: number, user: User, userId: number) {
    const workspace = await this.workspaceRepository
      .createQueryBuilder('workspaces')
      .leftJoinAndSelect('workspaces.owner', 'owner')
      .where('workspaces.id =:workspaceId', { workspaceId })
      .getOne();
    if (!workspace || workspace.owner.id !== user.id) {
      throw new BadRequestException(returnMessages.WorkspaceNotFound);
    }
    await this.userWorkspaceRepository
      .createQueryBuilder('user_workspaces')
      .leftJoinAndSelect('user_workspaces.workspace', 'workspaces')
      .softDelete()
      .where('user = :userId', { userId })
      .execute();
  }
}
