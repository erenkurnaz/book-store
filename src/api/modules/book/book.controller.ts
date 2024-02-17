import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { RolesGuard } from '../../../security/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../../database/user';
import { BookCreateDto } from './dto/book-create.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { Pagination, PaginationOptions, Public } from '../../decorators';
import { Book } from '../../../database/book';

@Controller('book')
@UseGuards(RolesGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @Public()
  public async getAll(
    @Pagination() pagination: PaginationOptions<Book>,
    @Query('keyword') keyword?: string,
  ) {
    return await this.bookService.findBookAvailability(keyword, pagination);
  }
  @Post()
  @Roles([UserRole.ADMIN])
  public async create(@Body() bookCreateDto: BookCreateDto) {
    return await this.bookService.create(bookCreateDto);
  }

  @Put(':id/adjust-inventory')
  @Roles([UserRole.STORE_MANAGER], true)
  public async adjustStock(
    @Param('id') id: string,
    @Body() adjustInventoryDto: AdjustInventoryDto,
  ) {
    return this.bookService.adjustInventoryQuantity(id, adjustInventoryDto);
  }
}
