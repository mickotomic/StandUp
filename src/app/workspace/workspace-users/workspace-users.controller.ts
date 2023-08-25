import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { WorkspaceUsersService } from './workspace-users.service';

@ApiTags('app-workspace-users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('/app/workspace-users')
export class WorkspaceUsersController {
  constructor(private readonly workspaceUsersService: WorkspaceUsersService) {}

  @ApiParam({ name: 'id' })
  @Get('/:id')
  async getListOfUsers(@Param('id') workspaceId, @GetUser() user: User) {
    return await this.workspaceUsersService.getListOfUsers(+workspaceId, user);
  }

  @HttpCode(204)
  @Delete('/:workspaceId/:userId')
  async removeUsers(
    @Param('workspaceId') workspaceId: number,
    @Param('userId') userId: number,
    @GetUser() user: User,
  ) {
    return await this.workspaceUsersService.removeUser(
      workspaceId,
      user,
      userId,
    );
  }
}
