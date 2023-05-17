import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: 'task'})
@export class Task {
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

    @Column()
    deadline: Date;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column()
    deletedAt: Date;
}