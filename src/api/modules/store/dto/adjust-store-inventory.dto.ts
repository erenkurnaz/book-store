import { IsNotEmpty, IsNumber } from 'class-validator';

export class AdjustStoreInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  quantityChange: number;

  @IsNotEmpty()
  bookId: string;
}
