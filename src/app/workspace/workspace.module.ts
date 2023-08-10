import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from 'src/entities/user-token.entity';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceProcess } from './workspace.process';
import { WorkspaceService } from './workspace.service';
import { UserWorkspaceModule } from './workspace-users/workspace-users.module';

@Module({
  imports: [
    UserWorkspaceModule,
    TypeOrmModule.forFeature([Workspace, User, UserToken, UserWorkspace]),
    BullModule.registerQueue({
      limiter: { max: 5, duration: 5000 },
      name: 'workspace',
    }),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceProcess],
})
export class WorkspaceModule {}
