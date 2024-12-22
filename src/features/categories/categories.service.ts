import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, FindOptionsWhere } from 'typeorm';

import { HandleDBExceptions } from 'src/common/helpers';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginationService } from 'src/common/services/pagination.service';
import { User } from '../users/entities/user.entity';
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly paginationService: PaginationService,
  ) {}

  private readonly ctxName = this.constructor.name;

  async create(createCategoryDto: CreateCategoryDto, user: User) {
    try {
      const category = this.categoryRepository.create({
        ...createCategoryDto,
        userId: user,
      });

      return await this.categoryRepository.save(category);
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit, offset, order, sort, term } = paginationDto;

    return await this.paginationService.paginate(this.categoryRepository, {
      limit,
      offset,
      order,
      where: { userId: { id: user.id } },
      sort: sort as keyof Category,
      // relations: ['images'],
    });
  }

  async findOne(id: string, user: User) {
    return await this.categoryRepository.findOne({
      where: {
        id,
        userId: { id: user.id },
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, user: User) {
    if ('userId' in updateCategoryDto) {
      throw new NotFoundException('User ID cannot be updated');
    }

    const category = await this.findOne(id, user);

    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);

    const newCategory = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });

    return await this.categoryRepository.save(newCategory);
  }

  async remove(id: string, user: User) {
    const category = await this.findOne(id, user);

    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);

    await this.categoryRepository.softRemove(category);

    return {
      message: `Category with id ${category.name} deleted successfully`,
    };
  }
}
