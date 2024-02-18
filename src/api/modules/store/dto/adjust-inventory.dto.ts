import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class AdjustInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  quantityChange: number;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  bookId: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  storeId: string;
}
