import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { UsersWidthTasksT } from 'src/types/user-width-tasks.type';
import { NextDto } from './dto/next.dto';
import { StandupDto } from './dto/standup.dto';
import { StandupService } from './standup.service';

@ApiTags('app-standup')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('/app/standup')
export class StandupController {
  constructor(private readonly standupService: StandupService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/:workspaceId/start-standup')
  async startStandup(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
  ): Promise<{ shuffledUsers: UsersWidthTasksT[]; count: number }> {
    return await this.standupService.startStandup(+workspaceId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/:workspaceId/finish-standup')
  async finishStandup(
    @Body() dto: StandupDto,
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
  ) {
    return await this.standupService.finishStandup(
      +workspaceId,
      dto.absentUsersId,
    );
  }

  @ApiOperation({
    description: `This endpoint should be used for fetching current 
    standup status in intervals`,
  })
  @Get('/:workspaceId/polling')
  async getCurrentUser(
    @GetUser() user: User,
    @Param('workspaceId') workspaceId: string,
  ): Promise<{
    userId?: number;
    isStandupInProgress: boolean;
    isLastMember: boolean;
    usersTasks: User[];
  }> {
    return await this.standupService.getCurrentUser(+workspaceId, user);
  }

  @Patch('/:workspaceId')
  async next(
    @Param('workspaceId') workspaceId: number,
    @Body() nextDto: NextDto,
    @GetUser() user: User,
  ) {
    return await this.standupService.next(+workspaceId, nextDto, user);
  }

  @ApiOperation({
    description:
      'This endpoint return all user worksapces with active standups',
  })
  @Get('/active')
  async getUserActiveStandups(
    @GetUser() user: User,
  ): Promise<{ workspaces: Workspace[] }> {
    return await this.standupService.getUserActiveStandups(user);
  }
}
