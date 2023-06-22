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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { StandupService } from './standup.service';


@ApiTags('app-standup')
@Controller('/app/standup')
export class StandupController {
  constructor(private readonly standupService: StandupService) {}

  // @ApiBody({
  //   description: 'Multiple emails separated by comma',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       emails: {
  //         type: 'string',
  //       },
  //     },
  //   },
  // })
  // @UseGuards(AuthGuard('jwt'))
  // @Post('/:id/invite')
  // async inviteUsers(
  //   @Param('id') workspaceId: string,
  //   @Body() invitedEmails: { emails: string },
  //   @GetUser() user: User,
  // ): Promise<void> {
  //   return await this.workspaceService.inviteUsers(
  //     +workspaceId,
  //     invitedEmails,
  //     user,
  //   );
  // }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('/verify')
  // async verifyInvitation(
  //   @Body() verifyTokenDto: VerifyTokenDto,
  //   @GetUser() user: User,
  // ): Promise<{ message: string; workspace: Workspace }> {
  //   return await this.workspaceService.verifyInvitation(verifyTokenDto, user);
  // }

  // @Get('/check/email')
  // async checkDoesEmailExists(
  //   @Query('email') email: string,
  // ): Promise<{ userExists: boolean }> {
  //   return await this.workspaceService.checkDoesEmailExists(email);
  // }
}
