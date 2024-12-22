import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

const maxLength = 25;
const minLength = 3;

export class UpdateUserDto {
  @IsString()
  @MaxLength(maxLength)
  @MinLength(minLength)
  @Transform(({ value }) => value.trim().toLowerCase())
  firstName: string;

  @IsString()
  @MaxLength(maxLength)
  @MinLength(minLength)
  @Transform(({ value }) => value.trim().toLowerCase())
  lastName: string;
}
