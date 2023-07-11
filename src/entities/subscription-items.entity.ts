import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Workspace } from "./workspace.entity";

@Entity({ name: 'subscriptionsItems' })
export class SubscriptionItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptionItems)
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.subscriptionItems)
  workspace: Workspace;

  @Column()
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}