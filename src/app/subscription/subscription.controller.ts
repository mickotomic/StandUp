import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { SubscriptionService } from './subscription.service';

@ApiTags('app-subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}
  // @UseGuards(WorkspaceOwner)
  @Get('/:workspaceId')
  async getWorkspaceSubscriptions(
    @Param('workspaceId') workspaceId: string,
    @Paginate() query: PaginateQuery,
  ) {
    return await this.subscriptionService.getWorkspaceSubscriptions(
      +workspaceId,
      query,
    );
  }
}
