import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Pagination, PaginationOptions } from '../../decorators';
import { RolesGuard } from '../../../security/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { User, UserRole } from '../../../database/user';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user-create.dto';

@Controller('user')
@UseGuards(RolesGuard)
@Roles([UserRole.ADMIN])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async create(@Body() userCreateDto: UserCreateDto) {
    return this.userService.create(userCreateDto);
  }

  @Get()
  public async getAll(
    @Pagination() pagination: PaginationOptions<User>,
    @Query('keyword') keyword?: string,
  ) {
    return await this.userService.getAll(keyword, pagination);
  }
}
