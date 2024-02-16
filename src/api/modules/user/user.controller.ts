import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Pagination, PaginationOptions } from '../../decorators';
import { RolesGuard } from '../../../security/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { User, UserRole } from '../../../database/user';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';

@Controller('user')
@UseGuards(RolesGuard)
@Roles([UserRole.ADMIN])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async create(@Body() userCreateDto: UserCreateDto) {
    return this.userService.create(userCreateDto);
  }

  @Patch(':id')
  public async update(
    @Param('id') userId: string,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    return this.userService.update(userId, userUpdateDto);
  }

  @Get()
  public async getAll(
    @Pagination() pagination: PaginationOptions<User>,
    @Query('keyword') keyword?: string,
  ) {
    return await this.userService.getAll(keyword, pagination);
  }
}
