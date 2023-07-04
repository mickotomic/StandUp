import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { StandupService } from './standup.service';

@ApiTags('app-standup')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('/app/standup')
export class StandupController {
  constructor(private readonly standupService: StandupService) {}

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
