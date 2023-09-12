import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { User } from 'src/entities/user.entity';
import { appLogger } from 'src/helpers/winston-logger.helper';
import { Repository } from 'typeorm';

@Injectable()
export class UserWorkspaceGuard
  extends AuthGuard('jwt')
  implements CanActivate
{
  constructor(
    @InjectRepository(UserWorkspace)
    private readonly userWorkspaceRepository: Repository<UserWorkspace>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      await (super.canActivate(context) as Promise<boolean>);
      const request = context.switchToHttp().getRequest();

      const user: User = request?.user;
      let workspaceId = request.params.workspaceId || request.params.id;
      if (!workspaceId) {
        workspaceId = request.query.workspaceId;
      }
      if (!user || !workspaceId) {
        return false;
      }
      const userWorkspace = await this.userWorkspaceRepository.findOne({
        where: { user: { id: user.id, workspaces: { id: workspaceId } } },
      });
      if (!userWorkspace) {
        return false;
      }
      return true;
    } catch (e) {
      appLogger.log({
        level: 'error',
        message: JSON.stringify(e.message),
        type: 'Unauthorized access error',
      });
      return false;
    }
  }
}
