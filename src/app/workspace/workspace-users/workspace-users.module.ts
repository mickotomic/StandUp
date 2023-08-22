import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { WorkspaceUsersController } from './workspace-users.controller';
import { WorkspaceUsersService } from './workspace-users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, User, UserWorkspace])],
  controllers: [WorkspaceUsersController],
  providers: [WorkspaceUsersService],
})
export class WorkspaceUserModule {}
