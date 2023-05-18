import { 
    Column, 
    Entity, 
    ManyToOne, 
    PrimaryGeneratedColumn 
} from "typeorm";
@import { Workspace } from './workspace.entity';


@Entity({ name: 'tasks'})
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.tasks)
    user: User;

    @ManyToOne(() => Workspace, (workspace) => workspace.tasks)
    workspace: Workspace;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    priority: string;

    @Column({ type: 'varchar' })
    status: string;

    @Column({ nullable: true})
    deadline: Date;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column()
    deletedAt: Date;
}