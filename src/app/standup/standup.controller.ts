import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { UsersWithTasksT } from 'src/types/user-with-tasks.type';
import { UserWorkspaceGuard } from 'src/guards/user-workspace.guard';
import { StandupDto } from './dto/standup.dto';
import { StandupService } from './standup.service';
import { FinishStandupDto } from './dto/finish-standup.dto';

@ApiTags('app-standup')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('/app/standup')
export class StandupController {
  constructor(private readonly standupService: StandupService) {}

  @UseGuards(UserWorkspaceGuard)
  @Post('/:workspaceId/start-standup')
  async startStandup(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
  ): Promise<{ shuffledUsers: UsersWithTasksT[]; count: number }> {
    return await this.standupService.startStandup(+workspaceId);
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('/:workspaceId/finish-standup')
  @UseGuards(UserWorkspaceGuard)
  
  async finishStandup(
    @Body() dto: FinishStandupDto,
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
  ) {
    return await this.standupService.finishStandup(+workspaceId, dto);
  }

  @ApiOperation({
    description: `This endpoint should be used for fetching current 
    standup status in intervals`,
  })
  @UseGuards(UserWorkspaceGuard)
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
    @Body() standupDto: StandupDto,
    @GetUser() user: User,
  ) {
    return await this.standupService.next(+workspaceId, standupDto, user);
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
