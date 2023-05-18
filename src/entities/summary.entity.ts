import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'summaries' })
export class Summary {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  date: Date;

  @Column()
  workspaceId: number;

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
}
