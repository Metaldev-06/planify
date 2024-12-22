import { Transform } from 'class-transformer';
import {
  IsIn,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EntityType } from 'src/common/enums/entity-type.enum';
import { User } from 'src/features/users/entities/user.entity';

export class CreateCategoryDto {
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @Transform(({ value }) => value.trim().toLowerCase())
  name: string;

  @IsString()
  icon?: string;

  @IsIn([EntityType.EXPENSE, EntityType.INCOME, EntityType.BOTH], {
    message: `type must be one of these values: ${EntityType.EXPENSE}, ${EntityType.INCOME}, ${EntityType.BOTH}`,
  })
  type: EntityType;

  @IsString()
  @Matches(/^#([0-9A-F]{3}){1,2}$/i, {
    message: 'iconColor must be a valid HEX color',
  })
  iconColor: string; // Color del ícono

  @IsString()
  @Matches(/^#([0-9A-F]{3}){1,2}$/i, {
    message: 'backgroundColor must be a valid HEX color',
  })
  backgroundColor: string; // Color de fondo
}
