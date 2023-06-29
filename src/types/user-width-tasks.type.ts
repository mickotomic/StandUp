import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';

export type UsersWidthTasksT = User | { tasks: Task[] };
