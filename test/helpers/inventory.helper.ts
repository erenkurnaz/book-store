import { APP } from './app.helper';
import { Inventory, InventoryRepository } from '../../src/database/inventory';

export async function createInventory({
  book,
  store,
  quantity = 5,
}: Partial<Inventory>): Promise<Inventory> {
  const inventoryRepository = APP.get<InventoryRepository>(InventoryRepository);
  const inventory = new Inventory();
  inventory.book = book;
  inventory.store = store;
  inventory.quantity = quantity;

  return inventoryRepository.upsert(inventory);
}
