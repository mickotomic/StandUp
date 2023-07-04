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
import { Task } from './task.entity';
import { Workspace } from './workspace.entity';

@Entity({ name: 'summaries' })
export class Summary {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Workspace, (workspace) => workspace.summaries)
  workspace: Workspace;

  @OneToMany(() => Task, (task) => task.summary)
  tasks: Task[];

  @Column({ default: null })
  tasksCompleted: number;

  @Column({ default: null })
  tasksDue: number;

  @Column({ default: null })
  tasksPastDue: number;

  @Column({ default: null })
  attendees: string;

  @Column({ default: null })
  absentUsers: string;

  @Column({ default: null })
  timespent: number;

  @Column()
  startedAt: Date;

  @Column({ default: null })
  finishedAt: Date;

  @Column()
  currentUser: number;

  @Column({ type: 'simple-json' })
  users: number[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

}
