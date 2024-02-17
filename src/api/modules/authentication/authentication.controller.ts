import { Controller, Body, Post, Get, HttpCode } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignInDto, SignUpDto } from './dto';
import { CurrentUser, Public } from '../../decorators';
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
  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.login(signInDto);
  }

  @Get('me')
  async getCurrentUser(@CurrentUser() user: UserDTO) {
    return user;
  }
}
