import { Injectable } from '@nestjs/common';
import { BookCreateDto } from './dto/book-create.dto';
import { Book, BookRepository } from '../../../database/book';
import { QueryOrder } from '@mikro-orm/core';
import { PaginationOptions } from '../../decorators';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  public async create(storeCreateDto: BookCreateDto) {
    const createdBook = this.bookRepository.create(storeCreateDto);
    await this.bookRepository.getEntityManager().flush();

    return createdBook;
  }

  async findBookAvailability(
    keyword?: string,
    pagination?: PaginationOptions<Book>,
  ) {
    const [results, total] = await this.bookRepository.findAndCount(
      {
        inventory: { quantity: { $gt: 0 } },
        ...(keyword && { name: { $like: `%${keyword}%` } }),
      },
      {
        limit: pagination?.limit,
        offset: pagination?.offset,
        orderBy: { createdAt: QueryOrder.DESC },
        populate: ['inventory'],
        fields: ['name'],
      },
    );

    return {
      results,
      total,
    };
  }
}
