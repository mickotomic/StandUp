import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from 'src/entities/user-token.entity';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { WorkspaceUserModule } from './workspace-users/workspace-users.module';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceProcess } from './workspace.process';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [
    WorkspaceUserModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Workspace, User, UserToken, UserWorkspace]),
    BullModule.registerQueue({
      limiter: {
        max: +process.env.QUEUES_LIMITER_MAX || 5,
        duration: +process.env.QUEUES_LIMITER_DURATION || 5000,
      },
      name: 'workspace',
    }),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceProcess],
})
export class WorkspaceModule {}
