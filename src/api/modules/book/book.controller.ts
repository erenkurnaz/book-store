import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { RolesGuard } from '../../../security/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../../database/user';
import { BookCreateDto } from './dto/book-create.dto';
import { Pagination, PaginationOptions, Public } from '../../decorators';
import { Book } from '../../../database/book';
import { BookFilterQuery } from './dto/book-filter-query';

@Controller('book')
@UseGuards(RolesGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @Public()
  public async getAll(
    @Pagination() pagination: PaginationOptions<Book>,
    @Query() filterQuery?: BookFilterQuery,
  ) {
    return await this.bookService.findBookAvailability(filterQuery, pagination);
  }

  @Post()
  @Roles([UserRole.ADMIN])
  public async create(@Body() bookCreateDto: BookCreateDto) {
    return await this.bookService.create(bookCreateDto);
  }
}
