import { IsString } from 'class-validator';
import { Book } from '../../../../database/book';

export class BookCreateDto implements Pick<Book, 'name'> {
  @IsString()
  name: string;
}
