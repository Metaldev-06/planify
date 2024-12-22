import * as generator from 'generate-password';

export const RandomPassowrd = (length: number): string => {
  return generator.generate({
    length,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
  });
};
