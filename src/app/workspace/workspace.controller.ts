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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { WorkspaceService } from './workspace.service';

@ApiTags('app-workspace')
@Controller('/app/workspaces')
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
  @UseGuards(AuthGuard('jwt'))
  @Post('/:id/invite')
  async inviteUsers(
    @Param('id') workspaceId: string,
    @Body() invitedEmails: { emails: string },
    @GetUser() user: User,
  ): Promise<void> {
    return await this.workspaceService.inviteUsers(
      +workspaceId,
      invitedEmails,
      user,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/verify')
  async verifyInvitation(
    @Query('workspaceId', ParseIntPipe) workspaceId: string,
    @Query('email') email: string,
    @Query('token') token: string,
    @GetUser() user: User,
  ): Promise<{ message: string; workspace: Workspace }> {
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
