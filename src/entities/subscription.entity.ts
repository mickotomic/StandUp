import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionItems } from './subscription-items.entity';
import { Workspace } from './workspace.entity';

@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Workspace, (workspace) => workspace.subscriptions)
  workspace: Workspace;

  @OneToMany(
    () => SubscriptionItems,
    (subscriptionItems) => subscriptionItems.subscription,
  )
  subscriptionItems: SubscriptionItems[];

  @Column()
  numberOfActiveUsers: number;

  @Column()
  price: number;

  @Column({ type: 'varchar', default: 'unpaid' })
  status: string;

  @Column({ default: null })
  transactionId: string;

  @Column({ default: null })
  errorStatus: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
