import * as request from 'supertest';
import { APP, clearDatabase } from '../helpers/app.helper';
import { createToken, createUser } from '../helpers/user.helper';
import { UserRole } from '../../src/database/user';
import { createBook } from '../helpers/book.helper';
import { createStore } from '../helpers/store.helper';
import { createInventory } from '../helpers/inventory.helper';
import { Book } from '../../src/database/book';
import { Store } from '../../src/database/store';

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

  describe('List Books:', () => {
    let BOOKS: Book[];
    let STORES: Store[];

    beforeEach(async () => {
      BOOKS = await Promise.all([
        createBook({}),
        createBook({}),
        createBook({}),
      ]);

      STORES = await Promise.all([createStore({}), createStore({})]);
      await Promise.all([
        createInventory({ book: BOOKS[0], store: STORES[0], quantity: 10 }),
        createInventory({ book: BOOKS[1], store: STORES[0], quantity: 5 }),
        createInventory({ book: BOOKS[2], store: STORES[1], quantity: 15 }),
        createInventory({ book: BOOKS[1], store: STORES[1], quantity: 0 }),
      ]);
    });

    it('should return all books with available in stores', async () => {
      return request(APP.getHttpServer())
        .get('/book')
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .expect(200)
        .expect((response) => {
          const paginatedResponse = response.body.data;

          expect(paginatedResponse).toBeDefined();
          expect(paginatedResponse.results.length).toEqual(3);
        });
    });

    it('should filter books by name filter', async () => {
      const searchedBook = BOOKS[0];
      return request(APP.getHttpServer())
        .get(`/book?keyword=${searchedBook.name}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .expect(200)
        .expect((response) => {
          const paginatedResponse = response.body.data;

          expect(paginatedResponse).toBeDefined();
          expect(paginatedResponse.results.length).toEqual(1);
          expect(paginatedResponse.results[0].id).toEqual(searchedBook.id);
        });
    });
  });
});
