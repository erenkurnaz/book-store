import { Injectable } from '@nestjs/common';
import { BookCreateDto } from './dto/book-create.dto';
import { BookRepository } from '../../../database/book';
import { BookAddToInventoryDto } from './dto/book-add-to-inventory.dto';
import { StoreRepository } from '../../../database/store';
import { InventoryRepository } from '../../../database/inventory';
import { wrap } from '@mikro-orm/core';

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
      bookStore: store,
      quantity: bookAddToInventoryDto.quantity,
    });
    await this.inventoryRepository.getEntityManager().flush();
    return wrap(store).populate(['inventory', 'inventory.book']);
  }
}
