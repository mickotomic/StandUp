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
import { User } from './user.entity';

@Entity({ name: 'workspaces' })
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => UserWorkspace, (userWorkspace) => userWorkspace.workspace)
  users: UserWorkspace[];

   @ManyToOne(() => User, (user) => user.ownerWorskpaces)
  owner: User;

  //@OneToMany(() => Task, (task) => task.workspace)
  //tasks: Task[];

  //@OneToMany(() => Summary, (summary) => summary.workspace)
  //summaries: Summary[]; */

  @Column({ type: 'varchar' })
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
