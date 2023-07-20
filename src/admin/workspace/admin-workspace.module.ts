import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from 'src/entities/workspace.entity';
import { AdminWorkspaceController } from './admin-workspace.controller';
import { AdminWorkspaceService } from './admin-workspace.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace])],
  providers: [AdminWorkspaceService],
  controllers: [AdminWorkspaceController],
})
export class AdminWorkspaceModule {}
