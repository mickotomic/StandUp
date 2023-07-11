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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { WorkspaceService } from './workspace.service';

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
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/:id/invite')
  async inviteUsers(
    @Param('id') workspaceId: string,
    @Body() invitedEmails: { emails: string },
    @GetUser() user: User,
  ): Promise<{ status: string; email: string }[]> {
    return await this.workspaceService.inviteUsers(
      +workspaceId,
      invitedEmails,
      user,
    );
  }

  @ApiOperation({
    description: `The idea is that user when gets the invitation, clicks on the link
      lands on FE then FE checks if user exist in the app by calling /check/email
      and if user exists, then it should be redirected to the login screen
      if doesn't exist then it should be redirect to the registration from 
      and only then this endpoint should be called`,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('/verify')
  async verifyInvitation(
    @Body() verifyTokenDto: VerifyTokenDto,
    @GetUser() user: User,
  ): Promise<{
    message: string;
    workspace: Pick<Workspace, 'id' | 'projectName'>;
  }> {
    return await this.workspaceService.verifyInvitation(verifyTokenDto, user);
  }

  @ApiOperation({
    description: 'Checks if there is an user entity with provided email',
  })
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
  @ApiQuery({ name: 'withDeleted', description: 'Can be true or false' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAllWorkspaces(
    @GetUser() user: User,
    @Query('withDeleted') withDeleted: string,
  ): Promise<{ workspaces: Workspace[]; count: number }> {
    return await this.workspaceService.findAllWorkspaces(user, withDeleted);
  }

  @ApiBearerAuth()
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
  ): Promise<Workspace> {
    return await this.workspaceService.restoreWorkspace(+id, user);
  }
}
