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
import { UserWorkspace } from './user-workspace.entity';

@Entity({ name: 'workspaces' })
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => UserWorkspace, (userWokrspace) => userWokrspace.workspaceId)
  users: UserWorkspace[];

  @ManyToOne(() => User, (user) => user.ownedWorkspaces, {
    cascade: ['soft-remove'],
  })
  ownerId: User;

  @Column({ type: 'string' })
  projectName: string;

  @Column({ type: 'json' })
  settings: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
