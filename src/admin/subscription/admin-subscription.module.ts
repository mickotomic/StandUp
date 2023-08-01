import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subscription } from "src/entities/subscription.entity";
import { AdminSubscriptionService } from "./admin-subscription.service";
import { AdminSubscriptionController } from "./admin-subscription.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Subscription])],
    controllers: [AdminSubscriptionController],
    providers: [AdminSubscriptionService],
  })
  export class AdminSubscriptionModule {}