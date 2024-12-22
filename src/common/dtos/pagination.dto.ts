import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { SortOrder } from '../enums/sort-order.enum';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @Max(50)
  @Min(0)
  limit?: number = 10;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  @IsIn([SortOrder.ASC, SortOrder.DESC])
  order?: SortOrder.ASC | SortOrder.DESC = SortOrder.ASC;

  @IsOptional()
  @IsString()
  sort?: string = 'id';

  @IsOptional()
  @IsString()
  term?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date; // Fecha de inicio en formato ISO 8601

  @IsOptional()
  @IsDateString()
  endDate?: Date; // Fecha de fin en formato ISO 8601
}
