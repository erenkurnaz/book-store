import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CurrentUser, Pagination, PaginationOptions } from '../../decorators';
import { Store } from '../../../database/store';
import { RolesGuard } from '../../../security/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserDTO, UserRole } from '../../../database/user';
import { StoreCreateDto } from './dto/store-create.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { QueryOrder } from '@mikro-orm/core';

@Controller('store')
@UseGuards(RolesGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @Roles([UserRole.ADMIN])
  public async create(@Body() storeCreateDto: StoreCreateDto) {
    return await this.storeService.create(storeCreateDto);
  }

  @Get()
  public async getAll(
    @Pagination<Store>({
      limit: 10,
      offset: 0,
      orderBy: 'createdAt',
      order: QueryOrder.DESC,
    })
    pagination: PaginationOptions<Store>,
    @Query('keyword') keyword?: string,
  ) {
    return await this.storeService.getAll(keyword, pagination);
  }

  @Put('adjust-inventory')
  @Roles([UserRole.STORE_MANAGER], true)
  public async adjustInventory(
    @CurrentUser() user: UserDTO,
    @Body() adjustInventoryDto: AdjustInventoryDto,
  ) {
    this.storeService.validatePermission(user, adjustInventoryDto.storeId);

    return this.storeService.adjustInventoryQuantity(adjustInventoryDto);
  }
}
