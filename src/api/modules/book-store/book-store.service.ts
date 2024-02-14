import { Injectable } from '@nestjs/common';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';

import { BookStore, BookStoreRepository } from '../../../database/book-store';
import { PaginatedResult, PaginationOptions } from '../../decorators';

@Injectable()
export class BookStoreService {
  constructor(private readonly bookStoreRepository: BookStoreRepository) {}

  public async getAll(
    keyword?: string,
    pagination?: PaginationOptions<BookStore>,
  ): Promise<PaginatedResult<BookStore>> {
    let where: FilterQuery<BookStore> = {};
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
}
