import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity';

@Entity({ name: 'summaries' })
export class Summary {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Workspace, (workspace) => workspace.summaries)
  workspace: Workspace;

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
