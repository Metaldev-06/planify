import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Category } from 'src/features/categories/entities/category.entity';

export class CreateExpenseDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  @Transform(({ value }) => value.trim())
  description?: string;

  @IsDateString()
  date: Date;

  @IsUUID()
  categoryId: Category;
}
