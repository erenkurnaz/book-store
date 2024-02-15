import * as request from 'supertest';
import { APP } from '../helpers/app.helper';
import { User, UserRole } from '../../src/database/user';
import { createToken, createUser } from '../helpers/user.helper';
import { faker } from '@faker-js/faker';

describe('Authentication (e2e)', () => {
  const PASSWORD = '123456';
  let USER: User;

  beforeEach(async () => {
    USER = await createUser({ password: PASSWORD });
  });

  it('should sign in the user and return an access token', async () => {
    return request(APP.getHttpServer())
      .post('/auth/sign-in')
      .send({ email: USER.email, password: PASSWORD })
      .expect(200)
      .expect((response) => {
        const { user, accessToken } = response.body.data;

        expect(accessToken).toBeDefined();
        expect(user.email).toEqual(user.email);
      });
  });

  it('should sign up a new user', async () => {
    const newUser = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      fullName: faker.person.fullName(),
    };

    return request(APP.getHttpServer())
      .post('/auth/sign-up')
      .send(newUser)
      .expect(201)
      .expect((response) => {
        const { user, accessToken } = response.body.data;

        expect(accessToken).toBeDefined();
        expect(user.email).toEqual(user.email);
        expect(user.role).toEqual(UserRole.USER);
      });
  });

  it('should get the current user', async () => {
    const token = await createToken({ id: USER.id, email: USER.email });
    return request(APP.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.data.email).toEqual(USER.email);
      });
  });
});
