import { Controller, Get, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { Pagination, PaginationOptions } from '../../decorators';
import { Store } from '../../../database/store';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  public async getAll(
    @Pagination() pagination: PaginationOptions<Store>,
    @Query('keyword') keyword?: string,
  ) {
    return await this.storeService.getAll(keyword, pagination);
  }
}
