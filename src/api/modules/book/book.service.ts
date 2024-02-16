import { Injectable } from '@nestjs/common';
import { BookCreateDto } from './dto/book-create.dto';
import { BookRepository } from '../../../database/book';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  public async create(storeCreateDto: BookCreateDto) {
    const createdBook = this.bookRepository.create(storeCreateDto);
    await this.bookRepository.getEntityManager().flush();

    return createdBook;
  }
}
