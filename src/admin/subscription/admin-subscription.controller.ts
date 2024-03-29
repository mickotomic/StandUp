import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Subscription } from 'src/entities/subscription.entity';
import { AdminRoleGuard } from 'src/guards/admin-role.guard';
import { AdminSubscriptionService } from './admin-subscription.service';
import { UpdateAdminSubscriptionDto } from './dto/update-subscription.dto';

@ApiTags('admin-subscriptions')
@ApiBearerAuth()
@UseGuards(AdminRoleGuard)
@Controller('admin/subscriptions')
export class AdminSubscriptionController {
  constructor(private readonly subscriptionService: AdminSubscriptionService) {}

  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @Get()
  async getSubscriptionList(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Subscription>> {
    return await this.subscriptionService.getSubscriptionsList(query);
  }

  @Put('/:subscriptionId')
  async updateSubscription(
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
    @Body() updateSubscriptionDto: UpdateAdminSubscriptionDto,
  ) {
    return await this.subscriptionService.updateSubscription(
      subscriptionId,
      updateSubscriptionDto,
    );
  }
}
