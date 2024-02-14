import { Controller, Get, Query } from '@nestjs/common';
import { BookStoreService } from './book-store.service';
import { Pagination, PaginationOptions } from '../../decorators';
import { BookStore } from '../../../database/book-store';

@Controller('book-store')
export class BookStoreController {
  constructor(private readonly bookStoreService: BookStoreService) {}

  @Get()
  public async getAll(
    @Pagination() pagination: PaginationOptions<BookStore>,
    @Query('keyword') keyword?: string,
  ) {
    return await this.bookStoreService.getAll(keyword, pagination);
  }
}
