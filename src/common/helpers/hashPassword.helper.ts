import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export const HashPassword = async (password: string, salt = 10) => {
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const ComparePassword = async (password: string, hash: string) => {
  if (!bcrypt.compareSync(password, hash))
    throw new UnauthorizedException('Credentials are not valid');
};
