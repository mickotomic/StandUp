import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from 'src/entities/user-token.entity';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { StandupService } from './standup.service';
import { StandupController } from './standup.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace, User, UserToken, UserWorkspace])],
  controllers: [StandupController],
  providers: [StandupService],
})
export class StandupModule {}
