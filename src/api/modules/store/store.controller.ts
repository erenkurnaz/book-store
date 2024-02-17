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
import { Pagination, PaginationOptions } from '../../decorators';
import { Store } from '../../../database/store';
import { RolesGuard } from '../../../security/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../../../database/user';
import { StoreCreateDto } from './dto/store-create.dto';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';

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
    @Pagination() pagination: PaginationOptions<Store>,
    @Query('keyword') keyword?: string,
  ) {
    return await this.storeService.getAll(keyword, pagination);
  }

  @Put('adjust-inventory')
  @Roles([UserRole.STORE_MANAGER], true)
  public async adjustInventory(@Body() adjustInventoryDto: AdjustInventoryDto) {
    return this.storeService.adjustInventoryQuantity(adjustInventoryDto);
  }
}
