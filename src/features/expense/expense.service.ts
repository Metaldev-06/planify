import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { HandleDBExceptions } from 'src/common/helpers';
import { User } from '../users/entities/user.entity';
import { PaginationService } from 'src/common/services/pagination.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { MovementTotalDto } from 'src/common/dtos/movements-total.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,

    private readonly paginationService: PaginationService,
  ) {}

  private ctxName = this.constructor.name;

  async create(createExpenseDto: CreateExpenseDto, user: User) {
    try {
      const expense = this.expenseRepository.create({
        ...createExpenseDto,
        userId: user,
      });
      return await this.expenseRepository.save(expense);
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  async getTotal(user: User, filters: MovementTotalDto): Promise<any> {
    const { categoryId, startDate, endDate } = filters;

    const query = this.expenseRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.userId = :userId', { userId: user.id });

    if (categoryId) {
      query.andWhere('expense.categoryId = :categoryId', { categoryId });
    }

    if (startDate) {
      query.andWhere('expense.date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('expense.date <= :endDate', { endDate });
    }

    const result = await query.getRawOne();
    return {
      total: result?.total || 0,
    };
  }

  async getTotalByCategory(
    user: User,
    filters: MovementTotalDto,
  ): Promise<any[]> {
    const { startDate, endDate } = filters;

    const query = this.expenseRepository
      .createQueryBuilder('expense')
      .select('expense.categoryId', 'categoryId')
      .addSelect('category.name', 'categoryName') // Agrega el nombre de la categoría
      .addSelect('SUM(expense.amount)', 'total') // Suma los montos
      .leftJoin('expense.categoryId', 'category') // Realiza un JOIN con la tabla de categorías
      .where('expense.userId = :userId', { userId: user.id }) // Filtra por el usuario

      .groupBy('expense.categoryId') // Agrupa por categoría
      .addGroupBy('category.name'); // Asegura que el GROUP BY incluya el nombre de la categoría

    if (startDate) {
      query.andWhere('expense.date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('expense.date <= :endDate', { endDate });
    }

    const result = await query.getRawMany();
    return result;
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit, offset, order, sort, term, category, startDate, endDate } =
      paginationDto;

    const query = this.expenseRepository.createQueryBuilder('expense');

    // Filtrar por usuario
    query.where('expense.userId = :userId', { userId: user.id });

    // Filtrar por categoría
    if (category) {
      query.leftJoinAndSelect('expense.categoryId', 'category');
      query.andWhere('category.name = :categoryName', {
        categoryName: category,
      });
    }

    // Filtrar por rango de fechas
    if (startDate) {
      query.andWhere('expense.date >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    if (endDate) {
      query.andWhere('expense.date <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    // Ordenar y paginar
    query.orderBy(`expense.${sort}`, order.toUpperCase() as 'ASC' | 'DESC');
    query.skip(offset).take(limit);

    // Obtener los datos y el total
    const [data, total] = await query.getManyAndCount();

    const pages = Math.ceil(total / limit);
    const current = Math.floor(offset / limit) + 1;

    return {
      data,
      pagination: {
        total,
        pages,
        current,
        limit,
        offset,
      },
    };
  }

  async findOne(id: string, user: User) {
    return await this.expenseRepository.findOne({
      where: {
        id,
        userId: { id: user.id },
      },
    });
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto, user: User) {
    const expense = await this.findOne(id, user);

    if (!expense) throw new NotFoundException('Expense not found');

    const newExpense = await this.expenseRepository.preload({
      id,
      ...updateExpenseDto,
    });

    return await this.expenseRepository.save(newExpense);
  }

  async remove(id: string, user: User) {
    const expense = await this.findOne(id, user);

    if (!expense) throw new NotFoundException('Expense not found');

    await this.expenseRepository.softRemove(expense);

    return {
      message: `Expense ${expense.name} deleted successfully`,
    };
  }
}
