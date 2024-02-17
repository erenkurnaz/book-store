import * as request from 'supertest';
import { APP, clearDatabase } from '../helpers/app.helper';
import { createStore } from '../helpers/store.helper';
import { createToken, createUser } from '../helpers/user.helper';
import { UserRole } from '../../src/database/user';
import { StoreCreateDto } from '../../src/api/modules/store/dto/store-create.dto';

describe('Store (e2e)', () => {
  let USER_TOKEN: string;

  beforeEach(async () => {
    await clearDatabase();
    const user = await createUser({});
    USER_TOKEN = await createToken({ id: user.id, email: user.email });
  });

  describe('Create Store:', () => {
    it('should return 403 if user is not an admin', async () => {
      const requestBody = new StoreCreateDto();
      requestBody.name = 'Store Name';
      return request(APP.getHttpServer())
        .post('/store')
        .send(requestBody)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .expect(403);
    });

    it('should create store by admin', async () => {
      const admin = await createUser({ role: UserRole.ADMIN });
      const ADMIN_TOKEN = await createToken({
        id: admin.id,
        email: admin.email,
      });
      const requestBody = new StoreCreateDto();
      requestBody.name = 'Store Name';
      return request(APP.getHttpServer())
        .post('/store')
        .send(requestBody)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .expect(201)
        .expect((response) => {
          const store = response.body.data;

          expect(store).toBeDefined();
          expect(store.name).toEqual(requestBody.name);
        });
    });
  });

  describe('List Stores:', () => {
    it('should return all stores', async () => {
      const stores = await Promise.all([createStore({}), createStore({})]);
      return request(APP.getHttpServer())
        .get('/store')
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .expect(200)
        .expect((response) => {
          const { results, total } = response.body.data;
          expect(results.length).toEqual(stores.length);
          expect(total).toEqual(stores.length);
        });
    });

    it('should apply pagination params', async () => {
      const [LIMIT, OFFSET] = [1, 0];
      const stores = await Promise.all([createStore({}), createStore({})]);
      return request(APP.getHttpServer())
        .get(`/store?limit=${LIMIT}&offset=${OFFSET}`)
        .set('Authorization', `Bearer ${USER_TOKEN}`)
        .expect(200)
        .expect((response) => {
          const { results, total } = response.body.data;
          expect(results.length).toEqual(LIMIT);
          expect(total).toEqual(stores.length);
        });
    });
  });
});
