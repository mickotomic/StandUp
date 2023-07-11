import { 
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Workspace } from "./workspace.entity";

@Entity({ name: 'subscriptions' })
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;


//   subscription entity:
// workspace
// numberOfActiveUsers
// price
// status(paid, unpaid, refunded)
// transactionId
// errorStatus

@ManyToOne(() => Workspace, (workspace) => workspace.subscription)
workspace: Workspace;

@Column()
numberOfActiveUsers: number;

@Column()
price: number;

@Column({ type: 'varchar', default: 'unpaid', })
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