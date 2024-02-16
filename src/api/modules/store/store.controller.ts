import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { Pagination, PaginationOptions } from '../../decorators';
import { Store } from '../../../database/store';
import { RolesGuard } from '../../../security/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../../database/user';

@Controller('store')
@UseGuards(RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @Roles(UserRole.USER, UserRole.STORE_MANAGER, UserRole.ADMIN)
  public async getAll(
    @Pagination() pagination: PaginationOptions<Store>,
    @Query('keyword') keyword?: string,
  ) {
    return await this.storeService.getAll(keyword, pagination);
  }
}
