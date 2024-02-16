import * as request from 'supertest';
import { APP, clearDatabase } from '../helpers/app.helper';
import { createToken, createUser } from '../helpers/user.helper';
import { UserRole } from '../../src/database/user';

describe('User (e2e)', () => {
  let ADMIN_TOKEN: string;

  beforeEach(async () => {
    await clearDatabase();
    const user = await createUser({ role: UserRole.ADMIN });
    ADMIN_TOKEN = await createToken({ id: user.id, email: user.email });
  });

  it('should return 403 if user is not an admin', async () => {
    const user = await createUser({ role: UserRole.USER });
    const token = await createToken({ id: user.id, email: user.email });
    return request(APP.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('should return all users', async () => {
    const users = await Promise.all([createUser({}), createUser({})]);
    return request(APP.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .expect(200)
      .expect((response) => {
        const { results, total } = response.body.data;
        expect(results.length).toEqual(users.length + 1);
        expect(total).toEqual(users.length + 1);
      });
  });

  it('should apply pagination params', async () => {
    const [LIMIT, OFFSET] = [1, 0];
    const users = await Promise.all([createUser({}), createUser({})]);
    return request(APP.getHttpServer())
      .get(`/user?limit=${LIMIT}&offset=${OFFSET}`)
      .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      .expect(200)
      .expect((response) => {
        const { results, total } = response.body.data;
        expect(results.length).toEqual(LIMIT);
        expect(total).toEqual(users.length + 1);
      });
  });
});
