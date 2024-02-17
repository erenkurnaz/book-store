import * as request from 'supertest';
import { APP, clearDatabase } from '../helpers/app.helper';
import { createToken, createUser } from '../helpers/user.helper';
import { UserRole } from '../../src/database/user';
import { createBook } from '../helpers/book.helper';
import { createStore } from '../helpers/store.helper';
import { createInventory } from '../helpers/inventory.helper';
import { Book } from '../../src/database/book';
import { Store } from '../../src/database/store';
import { AdjustInventoryDto } from '../../src/api/modules/store/dto/adjust-inventory.dto';
import { UnprocessableEntityException } from '@nestjs/common';

describe('Inventory Management (e2e)', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('Adjust inventory', () => {
    let BOOK: Book;
    let STORE: Store;
    let STORE_MANAGER_TOKEN: string;

    beforeEach(async () => {
      BOOK = await createBook({});
      STORE = await createStore({});
      const storeManager = await createUser({ role: UserRole.STORE_MANAGER });
      STORE_MANAGER_TOKEN = await createToken({
        id: storeManager.id,
        email: storeManager.email,
      });
    });

    it('should return 403 if user is not a store manager or admin', async () => {
      const user = await createUser({ role: UserRole.USER });
      const token = await createToken({ id: user.id, email: user.email });
      const requestBody = new AdjustInventoryDto();
      requestBody.storeId = STORE.id;
      requestBody.bookId = BOOK.id;
      requestBody.quantityChange = 10;
      return request(APP.getHttpServer())
        .put(`/store/adjust-inventory`)
        .send(requestBody)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should throw exception if inventory not exists and quantity is negative', async () => {
      const requestBody = new AdjustInventoryDto();
      requestBody.storeId = STORE.id;
      requestBody.bookId = BOOK.id;
      requestBody.quantityChange = -10;

      return request(APP.getHttpServer())
        .put(`/store/adjust-inventory`)
        .send(requestBody)
        .set('Authorization', `Bearer ${STORE_MANAGER_TOKEN}`)
        .expect(422)
        .expect((response) => {
          const error = response.body.error;

          expect(error).toMatchObject({
            status: 422,
            message: 'Cannot remove stock from non-existent inventory.',
            name: UnprocessableEntityException.name,
            timestamp: expect.any(Number),
          });
        });
    });

    it('should throw exception if inventory exists and quantity to remove is greater than available', async () => {
      await createInventory({
        book: BOOK,
        store: STORE,
        quantity: 10,
      });
      const requestBody = new AdjustInventoryDto();
      requestBody.storeId = STORE.id;
      requestBody.bookId = BOOK.id;
      requestBody.quantityChange = -11;

      return request(APP.getHttpServer())
        .put(`/store/adjust-inventory`)
        .send(requestBody)
        .set('Authorization', `Bearer ${STORE_MANAGER_TOKEN}`)
        .expect(422)
        .expect((response) => {
          const error = response.body.error;

          expect(error).toMatchObject({
            status: 422,
            message: 'Cannot remove more stock than is available.',
            name: UnprocessableEntityException.name,
            timestamp: expect.any(Number),
          });
        });
    });

    it('should create inventory record with given quantity if inventory not exists', async () => {
      const requestBody = new AdjustInventoryDto();
      requestBody.storeId = STORE.id;
      requestBody.bookId = BOOK.id;
      requestBody.quantityChange = 1;
      return request(APP.getHttpServer())
        .put(`/store/adjust-inventory`)
        .send(requestBody)
        .set('Authorization', `Bearer ${STORE_MANAGER_TOKEN}`)
        .expect(200)
        .expect((response) => {
          const inventory = response.body.data;

          expect(inventory).toBeDefined();
          expect(inventory.store).toEqual(STORE.id);
          expect(inventory.book).toEqual(BOOK.id);
          expect(inventory.quantity).toEqual(requestBody.quantityChange);
        });
    });

    it('should decrease existing inventory quantity by given quantity', async () => {
      const inventory = await createInventory({
        book: BOOK,
        store: STORE,
        quantity: 10,
      });
      const requestBody = new AdjustInventoryDto();
      requestBody.storeId = STORE.id;
      requestBody.bookId = BOOK.id;
      requestBody.quantityChange = -5;

      const expectedQuantity = inventory.quantity + requestBody.quantityChange;
      return request(APP.getHttpServer())
        .put(`/store/adjust-inventory`)
        .send(requestBody)
        .set('Authorization', `Bearer ${STORE_MANAGER_TOKEN}`)
        .expect(200)
        .expect((response) => {
          const inventory = response.body.data;

          expect(inventory).toBeDefined();
          expect(inventory.store).toEqual(STORE.id);
          expect(inventory.book).toEqual(BOOK.id);
          expect(inventory.quantity).toEqual(expectedQuantity);
        });
    });
  });
});
