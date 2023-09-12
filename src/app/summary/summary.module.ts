import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Summary } from 'src/entities/summary.entity';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Summary, UserWorkspace])],
  controllers: [SummaryController],
  providers: [SummaryService],
})
export class SummaryModule {}
