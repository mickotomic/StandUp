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

  @ManyToOne(() => Workspace, (workspace) => workspace.users)
  workspace: Workspace;

  /* @ManyToOne(() => User, (user) => user.workspaces)
  user: User; */

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
