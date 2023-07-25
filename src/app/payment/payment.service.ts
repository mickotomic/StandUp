import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac } from 'crypto';
import { Subscription } from 'src/entities/subscription.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymantService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  async paymentStripe(subscriptionId: number) {
    const subscription = await this.subscriptionRepository.findOneBy({
      id: subscriptionId,
    });
    if (!subscription) {
      throw new BadRequestException(returnMessages.SubscriptionNotFound);
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });

    const token = uuidv4();
    const hash = createHmac('sha256', 'micko').update(token).digest('hex');

    await this.subscriptionRepository.update(
      { id: subscriptionId },
      {
        paymentAuthToken: hash,
      },
    );

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'EUR',
              unit_amount: subscription.price * 100,
              product_data: {
                name: 'subscription',
              },
            },
            quantity: 1,
          },
        ],
        success_url:
          process.env.APP_PORT +
          '/payment/sucess/' +
          subscriptionId +
          '?token=' +
          hash,
        cancel_url:
          process.env.APP_PORT + '/payment/canceled/' + subscriptionId,
      });
      await this.subscriptionRepository.update(
        { id: subscriptionId },
        { transactionId: session.id },
      );
      return session.url;
    } catch (e) {
      throw new BadRequestException(returnMessages.PaymentFailed);
    }
  }

  async sucess(subscriptionId: number, token: string) {
    const subscription = await this.subscriptionRepository.findOneBy({
      id: subscriptionId,
    });
    if (subscription.paymentAuthToken !== token) {
      throw new BadRequestException(returnMessages.TokenNotValid);
    }
    return await this.subscriptionRepository.save({
      ...subscription,
      status: 'paid',
    });
  }

  async cancel(subscriptionId: number) {
    const subscription = await this.subscriptionRepository.findOneBy({
      id: subscriptionId,
    });
    if (!subscription) {
      throw new BadRequestException(returnMessages.SubscriptionNotFound);
    }

    await this.subscriptionRepository.update(
      { id: subscriptionId },
      { status: 'canceled' },
    );
    return await { status: 'cancel' };
  }
}
