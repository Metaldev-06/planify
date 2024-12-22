import { Exclude } from 'class-transformer';
import { Category } from 'src/features/categories/entities/category.entity';
import { Expense } from 'src/features/expense/entities/expense.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: false,
  })
  firstName: string;

  @Column('text', {
    nullable: false,
  })
  lastName: string;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  username: string;

  @Column('text', {
    nullable: false,
    unique: true,
  })
  email: string;

  @Column('text', {
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column('text', {
    nullable: true,
  })
  image: string;

  @OneToMany(() => Category, (category) => category.userId)
  categories: Category[];

  @OneToMany(() => Expense, (expense) => expense.userId)
  expense: Expense[];

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
