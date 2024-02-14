import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Role } from '../src/database/role';
import { User } from '../src/database/user';
import { BookStore } from '../src/database/book-store';
import { Book } from '../src/database/book';
import { BookInventory } from '../src/database/book-inventory';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const roles = ['admin', 'user', 'store_manager'].map((name) =>
      em.create(Role, { name }),
    );
    const users = [
      {
        fullName: 'Admin Doe',
        email: 'admin@mail.com',
        password: 'password',
        roles: [roles[0]],
      },
      {
        fullName: 'User Doe',
        email: 'user@mail.com',
        password: 'password',
        roles: [roles[1]],
      },
      {
        fullName: 'Manager Doe',
        email: 'manager@mail.com',
        password: 'password',
        roles: [roles[2]],
      },
    ];
    users.map((user) => em.create(User, user));

    const bookStore = em.create(BookStore, {
      name: 'Book Store 1',
    });

    const books = [
      { name: 'Book 1' },
      { name: 'Book 2' },
      { name: 'Book 3' },
    ].map((book) => em.create(Book, book));

    [
      { book: books[0], bookStore, quantity: 10 },
      { book: books[1], bookStore, quantity: 15 },
    ].map((bookInventory) => em.create(BookInventory, bookInventory));
  }
}
