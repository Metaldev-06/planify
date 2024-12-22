import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const maxLength = 25;
const minLength = 3;

export class CreateUserDto {
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

  @IsString()
  @MaxLength(maxLength)
  @MinLength(minLength)
  @Transform(({ value }) => value.trim().toLowerCase())
  username: string;

  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @IsString()
  @MinLength(minLength)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  //   @IsString()
  @IsUrl()
  image: string;
}
