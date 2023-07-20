import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/subscription.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

@Injectable()
export class PaymantService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) { }

  async paymentStripe(subscriptionId = 5, amount = 100) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2022-11-15',
    });
    // try {
    //     const session = await stripe.checkout.sessions.create({
    //       customer: sessionStorage.account_holder.customer,
    //       payment_method_types: ['card'],
    //       mode: 'payment',
    //       line_items: [{
    //         price: amount,
    //         quantity: 1,
    //       }],
    //       sucess_url: process.env.APP_PORT + '/payment-sucess/' + subscriptionId,
    //       cancel_url: process.env.APP_PORT + '/payment-canceled/' + subscriptionId,
    //     }).send();
    //   } catch (e) {
    //     throw new BadRequestException('Eror creating payment intent', e)
    //   }
    }
}