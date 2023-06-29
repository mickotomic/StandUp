import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Summary } from './summary.entity';
import { User } from './user.entity';
import { Workspace } from './workspace.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.tasks)
  workspace: Workspace;

  @ManyToOne(() => Summary, (summary) => summary.tasks)
  summary: Summary;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', default: 'low' })
  priority: string;

  @Column({ type: 'varchar', default: 'not_started' })
  status: string;

  @Column({ nullable: true })
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
