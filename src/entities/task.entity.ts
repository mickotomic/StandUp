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
import { Workspace } from './workspace.entity';
import { User } from './user.entity';
import { Summary } from './summary.entity';

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

  @Column({ type: 'varchar' })
  priority: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column()
  taskType: string;

  @Column({ nullable: true })
  deadline: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
