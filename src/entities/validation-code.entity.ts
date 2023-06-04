import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'validation_code' })
export class ValidationCode {
  @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => User, (user) => user.code)
    user: User;

  @Column({ type: 'varchar' })
    code: string;

  @Column({ type: 'integer', default: 0 })
    numberOfTries: number;

  @Column({ type: 'boolean', default: true })
    isValid: boolean;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;

  @DeleteDateColumn()
    deletedAt: Date;
}
