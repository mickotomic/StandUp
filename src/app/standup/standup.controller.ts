import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
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
}
