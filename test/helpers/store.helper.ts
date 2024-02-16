import { APP } from './app.helper';
import { faker } from '@faker-js/faker';
import { Store, StoreRepository } from '../../src/database/store';

export async function createStore({
  name = faker.company.name(),
}: Partial<Store>): Promise<Store> {
  const storeRepository = APP.get<StoreRepository>(StoreRepository);
  const createdStore = storeRepository.create({
    name,
  });
  await storeRepository.getEntityManager().flush();

  return createdStore;
}
