import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { StandupService } from './standup.service';

@ApiTags('app-standup')
@Controller('/app/standup')
export class StandupController {
  constructor(private readonly standupService: StandupService) {}

  @ApiParam({ name: 'id', description: 'Workspace id', type: 'number' })
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
