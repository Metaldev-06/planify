import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginAuthDto, RegisterAuthDto } from './dto';
import { UsersService } from '../users/users.service';
import { ComparePassword, HandleDBExceptions } from 'src/common/helpers';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { RandomPassowrd } from 'src/common/helpers/randomPassword.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,

    private readonly jwtService: JwtService,
  ) {}

  private readonly ctxName = this.constructor.name;

  async login({ email, password }: LoginAuthDto) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) throw new UnauthorizedException('Credentials are not valid');

    await ComparePassword(password, user.password);

    return {
      token: this.jwtService.sign({ email }),
      user,
    };
  }

  async register(registerAuthDto: RegisterAuthDto) {
    try {
      const user = await this.userService.create(registerAuthDto);

      return {
        token: this.getJtwToken({ email: user.email }),
        user,
      };
    } catch (error) {
      HandleDBExceptions(error, this.ctxName);
    }
  }

  async handleGoogleLogin(payload: any) {
    const { user } = payload;

    const existUser = await this.userService.findOneByEmail(user.email);

    if (!existUser) {
      const newUser = await this.userService.create({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.email.split('@')[0] + '-' + RandomPassowrd(5),
        email: user.email,
        password: RandomPassowrd(16),
        image: user.image,
      });

      const userCreated = {
        token: this.getJtwToken({ email: newUser.email }),
        user: newUser,
      };

      return userCreated;
    }

    return {
      token: this.getJtwToken({ email: existUser.email }),
      user: existUser,
    };
  }

  private getJtwToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
