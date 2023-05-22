import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';

import { WorkspaceService } from './workspace.service';

@ApiTags('user-workspace')
@Controller('/users/workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @ApiBody({
    description: 'Multiple emails sepparated by comma',
    schema: {
      type: 'object',
      properties: {
        emails: {
          type: 'string',
        },
      },
    },
  })
  @Post('/:id/invite')
  async inviteUsers(
    @Param('id') id: string,
    @Body() invitedEmails: { emails: string },
    /*@GetUser()*/ user: User,
  ): Promise<void> {
    return await this.workspaceService.inviteUsers(+id, invitedEmails, user);
  }

  @Get('/:id/invite')
  async verifyInvite(
    @Param('id') id: string,
    @Query('email') email: string,
    @Query('token') token: string,
    /*@GetUser()*/ user: User,
  ) {
    return await this.workspaceService.verifyInvite(+id, email, token, user);
  }

  @Get('/check/email')
  async checkDoesEmailExists(
    @Query('email') email: string,
    // @Query('token') token: string,
    // @Query('workspaceId') workspaceId: number,
  ) {
    return await this.workspaceService.checkDoesEmailExists(email);
  }
}
