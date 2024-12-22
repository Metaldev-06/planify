import { IsOptional, IsUUID, IsDateString } from 'class-validator';

export class MovementTotalDto {
  @IsOptional()
  @IsUUID()
  categoryId?: string; // Filtrar por una categoría específica

  @IsOptional()
  @IsDateString()
  startDate?: Date; // Fecha de inicio en formato ISO 8601

  @IsOptional()
  @IsDateString()
  endDate?: Date; // Fecha de fin en formato ISO 8601
}
