import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { SubscriptionService } from './subscription.service';

@ApiTags('app-subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/:workspaceId')
  async getWorkspaceSubscriptions(
    @Param('workspaceId') workspaceId: string,
    @Paginate() query: PaginateQuery,
    @GetUser() user: User,
  ) {
    return await this.subscriptionService.getWorkspaceSubscriptions(
      +workspaceId,
      query,
      user,
    );
  }
}
