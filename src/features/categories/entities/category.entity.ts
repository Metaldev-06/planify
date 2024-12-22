import { Exclude } from 'class-transformer';
import { EntityType } from 'src/common/enums/entity-type.enum';
import { Expense } from 'src/features/expense/entities/expense.entity';
import { User } from 'src/features/users/entities/user.entity';
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

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({ nullable: true })
  icon: string;

  @Column('text', {
    default: EntityType.EXPENSE,
  })
  type: EntityType;

  @Column({ nullable: true })
  iconColor: string;

  @Column({ nullable: true })
  backgroundColor: string;

  @OneToMany(() => Expense, (expense) => expense.categoryId)
  expenses: Expense[];

  @ManyToOne(() => User, (user) => user.categories)
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
