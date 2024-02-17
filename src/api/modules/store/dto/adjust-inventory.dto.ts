import { IsNotEmpty, IsNumber } from 'class-validator';

export class AdjustInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  quantityChange: number;

  @IsNotEmpty()
  bookId: string;

  @IsNotEmpty()
  storeId: string;
}
