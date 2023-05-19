import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from 'src/entities/user-token.entity';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceProcessor } from './workspace.processor';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace, User, UserToken, UserWorkspace]),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceProcessor],
})
export class WorkspaceModule {}
