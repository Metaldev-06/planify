import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any; // Define el tipo apropiado para `user` si lo tienes
}
