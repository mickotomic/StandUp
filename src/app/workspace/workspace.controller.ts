import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
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
    @Param('id') workspaceId: string,
    @Body() invitedEmails: { emails: string },
    /*@GetUser()*/ user: User,
  ): Promise<void> {
    return await this.workspaceService.inviteUsers(
      +workspaceId,
      invitedEmails,
      user,
    );
  }

  @Get('/verify')
  async verifyInvitation(
    @Query('workspaceId', ParseIntPipe) workspaceId: string,
    @Query('email') email: string,
    @Query('token') token: string,
    // user can't login without vertifyed email
    /*@GetUser()*/ user: User,
  ): Promise<{ user: User; workspaceId: number }> {
    return await this.workspaceService.verifyInvitation(
      +workspaceId,
      email,
      token,
      user,
    );
  }

  @Get('/check/email')
  async checkDoesEmailExists(
    @Query('email') email: string,
  ): Promise<{ userExists: boolean }> {
    return await this.workspaceService.checkDoesEmailExists(email);
  }
}
