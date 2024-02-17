import { IsNotEmpty, IsNumber } from 'class-validator';

export class AdjustInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  quantityChange: number;

  @IsNotEmpty()
  storeId: string;
}
