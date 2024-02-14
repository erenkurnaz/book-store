import { Controller, Body, Post, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto';
import { CurrentUser, Public } from '../../decorators';
import { Loaded } from '@mikro-orm/core';
import { UserDTO } from '../../../database/user';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() registerDto: SignUpDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Get('sign-in')
  async signIn(@Body() registerDto: SignUpDto) {
    return this.authService.login(registerDto);
  }

  @Get('me')
  async getCurrentUser(@CurrentUser() user: Loaded<UserDTO, 'roles'>) {
    return user;
  }
}
