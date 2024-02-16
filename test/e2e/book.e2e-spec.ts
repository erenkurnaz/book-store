import * as request from 'supertest';
import { APP, clearDatabase } from '../helpers/app.helper';
import { createToken, createUser } from '../helpers/user.helper';
import { UserRole } from '../../src/database/user';
import { createBook } from '../helpers/book.helper';
import { createStore } from '../helpers/store.helper';

describe('Book (e2e)', () => {
  let ADMIN_TOKEN: string;

  beforeEach(async () => {
    await clearDatabase();
    const user = await createUser({ role: UserRole.ADMIN });
    ADMIN_TOKEN = await createToken({ id: user.id, email: user.email });
  });

  describe('Create Book:', () => {
    it('should return 403 if user is not an admin', async () => {
      const user = await createUser({ role: UserRole.USER });
      const token = await createToken({ id: user.id, email: user.email });
      return request(APP.getHttpServer())
        .post('/book')
        .send({ name: 'Book Name' })
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should create book by admin', async () => {
      const bookData = { name: 'Book Name' };
      return request(APP.getHttpServer())
        .post('/book')
        .send({ name: 'Book Name' })
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .expect(201)
        .expect((response) => {
          const book = response.body.data;

          expect(book).toBeDefined();
          expect(book.name).toEqual(bookData.name);
        });
    });
  });

  describe('Add Book to Inventory:', () => {
    it('should return 403 if user is not a store manager or admin', async () => {
      const book = await createBook({});
      const user = await createUser({ role: UserRole.USER });
      const token = await createToken({ id: user.id, email: user.email });
      return request(APP.getHttpServer())
        .put(`/book/${book.id}/add-to-inventory`)
        .send({ storeId: 'store.id', quantity: 10 })
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('should add to inventory by store manager', async () => {
      const book = await createBook({});
      const store = await createStore({});
      const storeManager = await createUser({ role: UserRole.STORE_MANAGER });
      const storeManagerToken = await createToken({
        id: storeManager.id,
        email: storeManager.email,
      });

      return request(APP.getHttpServer())
        .put(`/book/${book.id}/add-to-inventory`)
        .send({ storeId: store.id, quantity: 10 })
        .set('Authorization', `Bearer ${storeManagerToken}`)
        .expect(200)
        .expect((response) => {
          const store = response.body.data;

          expect(store).toBeDefined();
          expect(store.inventory).toBeDefined();
          expect(store.inventory.length).toEqual(1);
          expect(store.inventory[0].quantity).toEqual(10);
        });
    });
  });
});
