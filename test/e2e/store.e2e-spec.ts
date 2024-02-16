import * as request from 'supertest';
import { APP, clearDatabase } from '../helpers/app.helper';
import { createStore } from '../helpers/store.helper';
import { createToken, createUser } from '../helpers/user.helper';

describe('Book Store (e2e)', () => {
  let TOKEN: string;

  beforeEach(async () => {
    await clearDatabase();
    const user = await createUser({});
    TOKEN = await createToken({ id: user.id, email: user.email });
  });

  it('should return all stores', async () => {
    const stores = await Promise.all([createStore({}), createStore({})]);
    return request(APP.getHttpServer())
      .get('/store')
      .set('Authorization', `Bearer ${TOKEN}`)
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
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200)
      .expect((response) => {
        const { results, total } = response.body.data;
        expect(results.length).toEqual(LIMIT);
        expect(total).toEqual(stores.length);
      });
  });
});
