import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'summary' })
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
  taskPastDue: number;

  @Column()
  atendees: string;

  @Column()
  absentUsers: string;

  @Column()
  timespent: number;
}
