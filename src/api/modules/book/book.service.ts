import { Injectable } from '@nestjs/common';
import { BookCreateDto } from './dto/book-create.dto';
import { Book, BookRepository } from '../../../database/book';
import { BookAddToInventoryDto } from './dto/book-add-to-inventory.dto';
import { StoreRepository } from '../../../database/store';
import { InventoryRepository } from '../../../database/inventory';
import { QueryOrder, wrap } from '@mikro-orm/core';
import { PaginationOptions } from '../../decorators';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly storeRepository: StoreRepository,
    private readonly inventoryRepository: InventoryRepository,
  ) {}

  public async create(storeCreateDto: BookCreateDto) {
    const createdBook = this.bookRepository.create(storeCreateDto);
    await this.bookRepository.getEntityManager().flush();

    return createdBook;
  }

  async addToInventory(
    bookId: string,
    bookAddToInventoryDto: BookAddToInventoryDto,
  ) {
    const book = await this.bookRepository.findOneOrFail({ id: bookId });
    const store = await this.storeRepository.findOneOrFail({
      id: bookAddToInventoryDto.storeId,
    });

    this.inventoryRepository.create({
      book,
      store,
      quantity: bookAddToInventoryDto.quantity,
    });
    await this.inventoryRepository.getEntityManager().flush();
    return wrap(store).populate(['inventory', 'inventory.book']);
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
