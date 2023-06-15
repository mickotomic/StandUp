import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity';
import { Task } from './task.entity';

@Entity({ name: 'summaries' })
export class Summary {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Workspace, (workspace) => workspace.summaries)
  workspace: Workspace;

  @ManyToOne(() => Task, (task) => task.summaries)
  tasks: Task;

  @Column()
  tasksCompleted: number;

  @Column()
  tasksDue: number;

  @Column()
  tasksPastDue: number;

  @Column()
  attendees: string;

  @Column()
  absentUsers: string;

  @Column()
  timespent: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
