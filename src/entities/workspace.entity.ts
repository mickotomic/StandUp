import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';
import { Summary } from './summary.entity';
import { Task } from './task.entity';
import { UserToken } from './user-token.entity';
import { UserWorkspace } from './user-workspace.entity';
import { User } from './user.entity';

@Entity({ name: 'workspaces' })
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => UserWorkspace, (userWorkspace) => userWorkspace.workspace)
  users: UserWorkspace[];

  @OneToMany(() => Subscription, (subscription) => subscription.workspace)
  subscriptions: Subscription[];

  @ManyToOne(() => User, (user) => user.ownerWorkspaces)
  owner: User;

  @OneToMany(() => Task, (task) => task.workspace)
  tasks: Task[];

  @OneToMany(() => Summary, (summary) => summary.workspace)
  summaries: Summary[];

  @OneToMany(() => UserToken, (userToken) => userToken.workspace)
  userTokens: UserToken[];

  @Column({ type: 'varchar' })
  projectName: string;

  @Column({ type: 'varchar' })
  settings: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
