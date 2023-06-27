import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
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
  async startStandup(@Body() workspace: { id: number }): Promise<any> {
    return await this.standupService.startStandup(+workspace.id);
  }

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
  @Post('/finish-standup')
  async finishStandup(@Body() workspace: { id: number }): Promise<any> {
    return await this.standupService.finishStandup(+workspace.id);
  }
}
