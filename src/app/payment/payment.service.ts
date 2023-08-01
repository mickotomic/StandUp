import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac } from 'crypto';
import { Subscription } from 'src/entities/subscription.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
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
      apiVersion: process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion,
    });

    const token = uuidv4();
    const hash = createHmac('sha256', process.env.TOKEN_SALT)
      .update(token)
      .digest('hex');

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
                name: `Subscription #${subscriptionId}`,
              },
            },
            quantity: 1,
          },
        ],
        success_url:
          `${process.env.BASE_URL}:${process.env.APP_PORT}` +
          '/payment/success/' +
          subscriptionId +
          '?token=' +
          hash,
        cancel_url:
          `${process.env.BASE_URL}:${process.env.APP_PORT}` +
          '/payment/cancel/' +
          subscriptionId,
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

  async success(subscriptionId: number, token: string) {
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

    return await this.subscriptionRepository.update(
      { id: subscriptionId },
      {
        status: 'canceled',
        errorObject: {
          action: returnMessages.PaymentCanceled,
        },
      },
    );
  }
}
