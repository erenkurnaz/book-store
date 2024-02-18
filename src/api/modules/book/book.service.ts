import { Injectable } from '@nestjs/common';
import { BookCreateDto } from './dto/book-create.dto';
import { Book, BookRepository } from '../../../database/book';
import { QueryOrder } from '@mikro-orm/core';
import { PaginationOptions } from '../../decorators';
import { Inventory } from '../../../database/inventory';
import { BookFilterQuery } from './dto/book-filter-query';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  public async create(bookCreateDto: BookCreateDto) {
    return this.bookRepository.getEntityManager().transactional(async (em) => {
      const book = new Book();
      book.name = bookCreateDto.name;
      const createdBook = em.create(Book, {
        name: bookCreateDto.name,
      });
      await em.flush();

      if (bookCreateDto.inventory) {
        await em
          .getRepository(Inventory)
          .upsertQuantity(
            createdBook.id,
            bookCreateDto.inventory.storeId,
            bookCreateDto.inventory.quantity,
          );
      }
      return createdBook;
    });
  }

  async findBookAvailability(
    filter?: BookFilterQuery,
    pagination?: PaginationOptions<Book>,
  ) {
    const [results, total] = await this.bookRepository.findAndCount(
      {
        ...(filter?.available && {
          inventory: { quantity: { $gt: 0 } },
        }),
        ...(filter?.keyword && { name: { $like: `%${filter.keyword}%` } }),
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
