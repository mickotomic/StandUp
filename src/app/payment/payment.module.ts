import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/subscription.entity';
import { PaymantController } from './payment.controller';
import { PaymantService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  controllers: [PaymantController],
  providers: [PaymantService],
})
export class PaymantModule {}
