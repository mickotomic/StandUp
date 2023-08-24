import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from 'src/entities/user-token.entity';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceProcess } from './workspace.process';
import { WorkspaceService } from './workspace.service';
import { WorkspaceUserModule } from './workspace-users/workspace-users.module';

@Module({
  imports: [
    WorkspaceUserModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Workspace, User, UserToken, UserWorkspace]),
    BullModule.registerQueue({
      limiter: {
        max: +process.env.QUEUES_LIMITER_MAX,
        duration: +process.env.QUEUES_LIMITER_DURATION,
      },
      name: 'workspace',
    }),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceProcess],
})
export class WorkspaceModule {}
