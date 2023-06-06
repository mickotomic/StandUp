import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';
import { Workspace } from './workspace.entity';

@Entity({ name: 'users_workspaces' })
export class UserWorkspace {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Task, (tasks) => tasks.workspace)
  tasks: Task;

  @ManyToOne(() => Workspace, (workspace) => workspace.users)
  workspace: Workspace;

  @ManyToOne(() => User, (user) => user.workspaces)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
