import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity';

@Entity({ name: 'users_workspaces' })
export class UserWorkspace {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Workspace, (workspace) => workspace.users, {
    cascade: ['soft-remove'],
  })
  workspaceId: Workspace;

  @ManyToOne(() => User, (user) => user.workspaces, {
    cascade: ['soft-remove'],
  })
  userId: User;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
