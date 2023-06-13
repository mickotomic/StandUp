import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@ApiTags('app-workspace')
@Controller('/app/workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @ApiBody({
    description: 'Multiple emails separated by comma',
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
  @ApiBearerAuth()
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
  @Post('/verify')
  async verifyInvitation(
    @Body() verifyTokenDto: VerifyTokenDto,
    @GetUser() user: User,
  ): Promise<{ message: string; workspace: Workspace }> {
    return await this.workspaceService.verifyInvitation(verifyTokenDto, user);
  }

  @Get('/check/email')
  async checkDoesEmailExists(
    @Query('email') email: string,
  ): Promise<{ userExists: boolean }> {
    return await this.workspaceService.checkDoesEmailExists(email);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createWorkspace(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @GetUser() user: User,
  ): Promise<Workspace> {
    return await this.workspaceService.createWorkspace(
      createWorkspaceDto,
      user,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAllWorkspaces(@GetUser() user: User): Promise<Workspace[]> {
    return await this.workspaceService.findAllWorkspaces(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  async findOneWorkspace(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() user: User,
  ): Promise<Workspace> {
    return await this.workspaceService.findOneWorkspace(+id, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async updateWorkspace(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkspaceDto: CreateWorkspaceDto,
    @GetUser() user: User,
  ) {
    return await this.workspaceService.updateWorkspace(
      +id,
      updateWorkspaceDto,
      user,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  @Delete('/:id')
  async removeWorkspace(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return await this.workspaceService.removeWorkspace(+id, user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/:id/restore')
  async restoreWorkspace(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return await this.workspaceService.restoreWorkspace(+id, user);
  }
}
