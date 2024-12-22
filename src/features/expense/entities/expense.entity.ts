import { Exclude } from 'class-transformer';
import { Category } from 'src/features/categories/entities/category.entity';
import { User } from 'src/features/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column('text', {
    nullable: false,
  })
  name: string;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @ManyToOne(() => Category, (category) => category.expenses)
  @Exclude()
  categoryId: Category;

  @ManyToOne(() => User, (user) => user.expense)
  @Exclude()
  userId: User;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
