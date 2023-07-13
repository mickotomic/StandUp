import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';
import { User } from './user.entity';

@Entity({ name: 'subscriptions_items' })
export class SubscriptionItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptionItems)
  user: User;

  @ManyToOne(
    () => Subscription,
    (subscription) => subscription.subscriptionItems,
  )
  subscription: Subscription;

  @Column()
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
