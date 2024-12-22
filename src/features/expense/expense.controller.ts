import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { User } from '../users/entities/user.entity';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { MovementTotalDto } from 'src/common/dtos/movements-total.dto';

@Controller('expense')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @GetUser() user: User) {
    return this.expenseService.create(createExpenseDto, user);
  }

  @Get('total')
  getTotal(@GetUser() user: User, @Query() filters: MovementTotalDto) {
    return this.expenseService.getTotal(user, filters);
  }

  @Get('total-by-category')
  getTotalByCategory(
    @GetUser() user: User,
    @Query() filters: MovementTotalDto,
  ) {
    return this.expenseService.getTotalByCategory(user, filters);
  }

  @Get()
  findAll(@GetUser() user: User, @Query() paginationDto: PaginationDto) {
    return this.expenseService.findAll(paginationDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.expenseService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @GetUser() user: User,
  ) {
    return this.expenseService.update(id, updateExpenseDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.expenseService.remove(id, user);
  }
}
