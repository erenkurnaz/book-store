import { Injectable } from '@nestjs/common';
import { BookCreateDto } from './dto/book-create.dto';
import { Book, BookRepository } from '../../../database/book';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { InventoryRepository } from '../../../database/inventory';
import { QueryOrder, wrap } from '@mikro-orm/core';
import { PaginationOptions } from '../../decorators';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly inventoryRepository: InventoryRepository,
  ) {}

  public async create(storeCreateDto: BookCreateDto) {
    const createdBook = this.bookRepository.create(storeCreateDto);
    await this.bookRepository.getEntityManager().flush();

    return createdBook;
  }

  async adjustInventoryQuantity(
    bookId: string,
    { storeId, quantityChange }: AdjustInventoryDto,
  ) {
    const book = await this.bookRepository.findOneOrFail({ id: bookId });
    await this.inventoryRepository.upsertQuantity(
      bookId,
      storeId,
      quantityChange,
    );

    return wrap(book).populate(['inventory']);
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
