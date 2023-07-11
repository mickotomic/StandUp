import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SubscriptionService } from "./subscription.service";

@ApiTags('app-subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}
}