import { BaseRepository } from '../base/base.repository';
import { Inventory } from './inventory.entity';
import { UnprocessableEntityException } from '@nestjs/common';

export class InventoryRepository extends BaseRepository<Inventory> {
  public async upsertQuantity(
    bookId: string,
    storeId: string,
    quantityChange: number,
  ) {
    const inventory = await this.findOne({
      book: bookId,
      store: storeId,
    });

    if (!inventory && quantityChange < 0) {
      throw new UnprocessableEntityException(
        'Cannot remove stock from non-existent inventory.',
      );
    } else if (inventory && inventory.quantity + quantityChange < 0) {
      throw new UnprocessableEntityException(
        'Cannot remove more stock than is available.',
      );
    }

    return this.upsert({
      book: bookId,
      store: storeId,
      quantity: inventory
        ? (inventory.quantity += quantityChange)
        : quantityChange,
    });
  }
}
