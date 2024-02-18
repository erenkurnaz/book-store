import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilterQuery } from '@mikro-orm/core';

import { Store, StoreRepository } from '../../../database/store';
import { PaginatedResult, PaginationOptions } from '../../decorators';
import { StoreCreateDto } from './dto/store-create.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { InventoryRepository } from '../../../database/inventory';
import { User, UserDTO, UserRole } from '../../../database/user';

@Injectable()
export class StoreService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly inventoryRepository: InventoryRepository,
  ) {}

  public async getAll(
    keyword?: string,
    pagination?: PaginationOptions<Store>,
  ): Promise<PaginatedResult<Store>> {
    let where: FilterQuery<Store> = {};
    if (keyword) {
      where = { name: { $ilike: `%${keyword}%` } };
    }

    const [results, total] = await this.storeRepository.findAndCount(where, {
      limit: pagination?.limit,
      offset: pagination?.offset,
      orderBy: { [pagination?.orderBy]: pagination?.order },
      populate: ['managers'],
    });

    return {
      results,
      total,
    };
  }

  public async create(storeCreateDto: StoreCreateDto) {
    return this.storeRepository.getEntityManager().transactional(async (em) => {
      const createdStore = em.create(Store, storeCreateDto);

      if (storeCreateDto.managerId) {
        const manager = await em.findOne(User, {
          id: storeCreateDto.managerId,
          role: UserRole.STORE_MANAGER,
        });
        if (!manager)
          throw new NotFoundException('Manager not exists or has invalid role');

        createdStore.managers.add(manager);
      }

      await em.flush();
      return createdStore;
    });
  }

  public async adjustInventoryQuantity({
    storeId,
    bookId,
    quantityChange,
  }: AdjustInventoryDto) {
    return this.inventoryRepository.upsertQuantity(
      bookId,
      storeId,
      quantityChange,
    );
  }

  public validatePermission(user: UserDTO, storeId: string) {
    if (user.role === 'admin') return true;

    const hasPermissionForStore = user.stores.some(
      (store) => store.id === storeId,
    );
    if (!hasPermissionForStore) {
      throw new ForbiddenException(
        'You do not have permission to manage this store',
      );
    }
  }

  public async getById(id: string) {
    const store = await this.storeRepository.findOne(
      { id },
      {
        populate: ['managers', 'inventory'],
      },
    );
    console.log(store);
    if (!store) throw new NotFoundException('Store not found');
    return store;
  }
}
