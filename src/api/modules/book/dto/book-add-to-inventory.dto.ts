import { IsNotEmpty, IsNumber } from 'class-validator';

export class BookAddToInventoryDto {
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  storeId: string;
}
