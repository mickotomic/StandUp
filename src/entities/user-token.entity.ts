import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from './workspace.entity';

@Entity({ name: 'users_token' })
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Workspace, (workspace) => workspace.userTokens)
  workspace: Workspace;

  @Column()
  userEmail: string;

  @Column()
  token: string;

  @Column({ default: true })
  isValid: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
