import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { RolesGuard } from '../../../security/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../../database/user';
import { BookCreateDto } from './dto/book-create.dto';
import { BookAddToInventoryDto } from './dto/book-add-to-inventory.dto';

@Controller('book')
@UseGuards(RolesGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @Roles([UserRole.ADMIN])
  public async create(@Body() bookCreateDto: BookCreateDto) {
    return await this.bookService.create(bookCreateDto);
  }

  @Put(':id/add-to-inventory')
  @Roles([UserRole.STORE_MANAGER], true)
  public async addToInventory(
    @Param('id') id: string,
    @Body() bookAddToInventoryDto: BookAddToInventoryDto,
  ) {
    return await this.bookService.addToInventory(id, bookAddToInventoryDto);
  }
}
