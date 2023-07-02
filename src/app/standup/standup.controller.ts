import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { UsersWidthTasksT } from 'src/types/user-width-tasks.type';
import { StandupService } from './standup.service';

@ApiTags('app-standup')
@Controller('/app/standup')
export class StandupController {
  constructor(private readonly standupService: StandupService) {}

  @ApiBearerAuth()
  @ApiBody({
    description: 'WorkspaceID object',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('/start-standup')
  async startStandup(
    @Body() workspace: { id: number },
  ): Promise<{ shuffledUsers: UsersWidthTasksT[]; count: number }> {
    return await this.standupService.startStandup(+workspace.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/polling')
  async getCurrentUser(
    @GetUser() user: User,
    @Param('id') workspaceId: string,
  ): Promise<{
    user?: User;
    isStandupInProgress: boolean;
    isLastMember: boolean;
  }> {
    return await this.standupService.getCurrentUser(+workspaceId, user);
  }
}
