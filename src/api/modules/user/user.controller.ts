import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Pagination, PaginationOptions } from '../../decorators';
import { RolesGuard } from '../../../security/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { User, UserRole } from '../../../database/user';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles([UserRole.ADMIN])
  public async getAll(
    @Pagination() pagination: PaginationOptions<User>,
    @Query('keyword') keyword?: string,
  ) {
    return await this.userService.getAll(keyword, pagination);
  }
}
