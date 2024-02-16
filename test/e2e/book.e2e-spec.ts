import * as request from 'supertest';
import { APP, clearDatabase } from '../helpers/app.helper';
import { createToken, createUser } from '../helpers/user.helper';
import { UserRole } from '../../src/database/user';

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
});
