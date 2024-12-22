import { Transform } from 'class-transformer';
import {
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Matches,
  IsUrl,
} from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
