import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserRole, User } from '../src/database/user';
import { Store } from '../src/database/store';
import { Book } from '../src/database/book';
import { Inventory } from '../src/database/inventory';
import { HashService } from '../src/security/services/hash.service';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const hashService = new HashService();
    const hashedPassword = await hashService.hash('password');
    const users = [
      {
        fullName: 'Admin Doe',
        email: 'admin@mail.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
      {
        fullName: 'User Doe',
        email: 'user@mail.com',
        password: hashedPassword,
        role: UserRole.USER,
      },
      {
        fullName: 'Manager Doe',
        email: 'manager@mail.com',
        password: hashedPassword,
        role: UserRole.STORE_MANAGER,
      },
    ].map((user) => em.create(User, user));

    const bookStore = em.create(Store, {
      name: 'Book Store 1',
    });
    const bookStore2 = em.create(Store, {
      name: 'Book Store 2',
    });
    bookStore2.managers.add(users[2]);

    const books = [
      { name: 'Book 1' },
      { name: 'Book 2' },
      { name: 'Book 3' },
    ].map((book) => em.create(Book, book));

    [
      { book: books[0], store: bookStore, quantity: 10 },
      { book: books[1], store: bookStore, quantity: 15 },
      { book: books[1], store: bookStore2, quantity: 15 },
    ].map((inventory) => em.create(Inventory, inventory));
  }
}
