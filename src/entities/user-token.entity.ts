import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity';

@Entity({ name: 'users-token' })
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userEmail: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.userTokens)
  workspace: Workspace;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;
}
