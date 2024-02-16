import { Injectable } from '@nestjs/common';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';

import { Store, StoreRepository } from '../../../database/store';
import { PaginatedResult, PaginationOptions } from '../../decorators';
import { StoreCreateDto } from './dto/store-create.dto';

@Injectable()
export class StoreService {
  constructor(private readonly bookStoreRepository: StoreRepository) {}

  public async getAll(
    keyword?: string,
    pagination?: PaginationOptions<Store>,
  ): Promise<PaginatedResult<Store>> {
    let where: FilterQuery<Store> = {};
    if (keyword) {
      where = { name: { $ilike: `%${keyword}%` } };
    }

    const [results, total] = await this.bookStoreRepository.findAndCount(
      where,
      {
        limit: pagination?.limit,
        offset: pagination?.offset,
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );

    return {
      results,
      total,
    };
  }

  public async create(storeCreateDto: StoreCreateDto) {
    const createdStore = this.bookStoreRepository.create(storeCreateDto);
    await this.bookStoreRepository.getEntityManager().flush();

    return createdStore;
  }
}
