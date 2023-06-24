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
import { Task } from './task.entity';

@Entity({ name: 'summaries' })
export class Summary {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Workspace, (workspace) => workspace.summaries)
  workspace: Workspace;

  @OneToMany(() => Task, (task) => task.summary)
  tasks: Task[];

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

  @Column()
  startedAt: Date;

  @Column({ default: null })
  finishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
