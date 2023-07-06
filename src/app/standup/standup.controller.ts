import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { UsersWidthTasksT } from 'src/types/user-width-tasks.type';
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

  @Get('/:workspaceId/polling')
  async getCurrentUser(
    @GetUser() user: User,
    @Param('workspaceId') workspaceId: string,
  ): Promise<{
    userId?: number;
    isStandupInProgress: boolean;
    isLastMember: boolean;
  }> {
    return await this.standupService.getCurrentUser(+workspaceId, user);
  }

  @Get('/:workspaceId')
  async next(
    @Param('workspaceId') workspaceId: number,
    @Query('direction') direction: string,
    @GetUser() user: User,
  ) {
    return await this.standupService.next(+workspaceId, direction, user);
  }
}
