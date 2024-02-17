import { ForbiddenException, Injectable } from '@nestjs/common';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';

import { Store, StoreRepository } from '../../../database/store';
import { PaginatedResult, PaginationOptions } from '../../decorators';
import { StoreCreateDto } from './dto/store-create.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { InventoryRepository } from '../../../database/inventory';
import { UserDTO } from '../../../database/user';

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
      orderBy: { createdAt: QueryOrder.DESC },
    });

    return {
      results,
      total,
    };
  }

  public async create(storeCreateDto: StoreCreateDto) {
    const createdStore = this.storeRepository.create(storeCreateDto);
    await this.storeRepository.getEntityManager().flush();

    return createdStore;
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
}
