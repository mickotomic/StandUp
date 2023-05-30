import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserWorkspace } from './user-workspace.entity';
import { Workspace } from './workspace.entity';
import { Task } from './task.entity';
import { ValidationCode } from './validation-code.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Workspace, (workspace) => workspace.owner)
  ownerWorkspaces: Workspace[];

  @OneToMany(() => UserWorkspace, (userWorkspace) => userWorkspace.user)
  workspaces: UserWorkspace[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => ValidationCode, (code) => code.user)
  code: ValidationCode;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', unique: true, length: 50 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', default: 'user' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: null })
  emailVerifiedAt: Date;
}
