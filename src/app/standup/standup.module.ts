import { Module } from '@nestjs/common';
import { StandupService } from './standup.service';
import { StandupController } from './standup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { Summary } from 'src/entities/summary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Summary, UserWorkspace])],
  controllers: [StandupController],
  providers: [StandupService],
})
export class StandupModule  {}
