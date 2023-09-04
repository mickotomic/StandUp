import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';

// probably User & { tasks: Task[] };
export type UsersWidthTasksT = User | { tasks: Task[] };
