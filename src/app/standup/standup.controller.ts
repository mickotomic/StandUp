import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { StandupService } from './standup.service';
import { StandUpDto } from './dto/standup.dto';


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
        workspace: {
          type: 'object',
          properties: {
            id: {
              type: 'number'
            }
          }
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('/start-standup')
  async startStandup(
    @GetUser() user: User,
    @Body() workspace: { id: number }
  ): Promise<any> {
    return await this.standupService.startStandup(+workspace.id, user);
  }

  @ApiBearerAuth()
  @ApiBody({
    description: 'WorkspaceID object',
    schema: {
      type: 'object',
      properties: {
        workspace: {
          type: 'object',
          properties: {
            id: {
              type: 'number'
            }
          }
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('/finish-standup')
  async finishStandup(
    @GetUser() user: User,
    @Body() workspace: { id: number }
  ): Promise<any> {
    return await this.standupService.finishStandup(+workspace.id, user);
  }
}
