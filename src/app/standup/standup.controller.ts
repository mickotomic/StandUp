import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersWidthTasksT } from 'src/types/user-width-tasks.type';
import { StandupDto } from './dto/standup.dto';
import { StandupService } from './standup.service';

@ApiTags('app-standup')
@Controller('/app/standup')
export class StandupController {
  constructor(private readonly standupService: StandupService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/start-standup/:id')
  async startStandup(
    @Param('id', ParseIntPipe) workspaceId: number,
  ): Promise<{ shuffledUsers: UsersWidthTasksT[]; count: number }> {
    return await this.standupService.startStandup(+workspaceId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/finish-standup/:id')
  async finishStandup(
    @Body() dto: StandupDto,
    @Param('id', ParseIntPipe) workspaceId: number,
  ) {
    return await this.standupService.finishStandup(
      +workspaceId,
      dto.absentUsersId,
    );
  }
}
