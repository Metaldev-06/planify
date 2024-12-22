import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HandleDBExceptions, HashPassword } from 'src/common/helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private ctxName = this.constructor.name;

  async create({ password, ...createUserDto }: CreateUserDto) {
    const hash = await HashPassword(password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hash,
    });

    return await this.userRepository.save(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    return user;
  }

  async findOne(id: string, user: User): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id,
        username: user.username,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: User) {
    if ('password' in updateUserDto) {
      throw new BadRequestException('Password cannot be updated here');
    }

    const currentUser = await this.findOne(id, user);

    if (!currentUser) throw new UnauthorizedException('User not found');

    const newUser = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!newUser) throw new BadRequestException('User not found');

    await this.userRepository.save(newUser);

    return newUser;
  }

  async remove(id: string, userReq: User) {
    const user = await this.findOne(id, userReq);
    if (!user) throw new UnauthorizedException('User not found');

    await this.userRepository.softRemove(user);

    return {
      message: 'User deleted',
    };
  }
}
