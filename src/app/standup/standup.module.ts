import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Summary } from 'src/entities/summary.entity';
import { UserToken } from 'src/entities/user-token.entity';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { StandupController } from './standup.controller';
import { StandupService } from './standup.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workspace,
      User,
      UserToken,
      UserWorkspace,
      Summary,
    ]),
  ],
  controllers: [StandupController],
  providers: [StandupService],
})
export class StandupModule {}
