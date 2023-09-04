import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';

@ApiTags('app-subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  // missing implementation
  constructor(private readonly subscriptionService: SubscriptionService) {}
}
