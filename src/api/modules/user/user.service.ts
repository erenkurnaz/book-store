import { Injectable } from '@nestjs/common';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';

import { PaginatedResult, PaginationOptions } from '../../decorators';
import { User, UserRepository } from '../../../database/user';
import { UserCreateDto } from './dto/user-create.dto';
import { HashService } from '../../../security/services/hash.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  public async getAll(
    keyword?: string,
    pagination?: PaginationOptions<User>,
  ): Promise<PaginatedResult<User>> {
    let where: FilterQuery<User> = {};
    if (keyword) {
      where = {
        $or: [
          { email: { $like: `%${keyword}%` } },
          { fullName: { $like: `%${keyword}%` } },
        ],
      };
    }

    const [results, total] = await this.userRepository.findAndCount(where, {
      limit: pagination?.limit,
      offset: pagination?.offset,
      orderBy: { createdAt: QueryOrder.DESC },
    });

    return {
      results,
      total,
    };
  }

  async create(userCreateDto: UserCreateDto) {
    userCreateDto.password = await this.hashService.hash(
      userCreateDto.password,
    );
    const createdUser = this.userRepository.create(userCreateDto);
    await this.userRepository.getEntityManager().flush();
    return createdUser;
  }
}
