import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SecurityModule } from '../security/security.module';
import { AccessTokenGuard } from '../security/guards/access-token.guard';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor, AllExceptionsFilter } from './interceptors';
import { AuthenticationController } from './modules/authentication/authentication.controller';
import { AuthenticationService } from './modules/authentication/authentication.service';
import { StoreController } from './modules/store/store.controller';
import { StoreService } from './modules/store/store.service';
import { UserService } from './modules/user/user.service';
import { UserController } from './modules/user/user.controller';
import { BookController } from './modules/book/book.controller';
import { BookService } from './modules/book/book.service';
import { ClassValidationPipe } from './pipes/class-validation.pipe';

@Module({
  imports: [DatabaseModule, SecurityModule],
  controllers: [
    AuthenticationController,
    StoreController,
    UserController,
    BookController,
  ],
  providers: [
    AuthenticationService,
    StoreService,
    UserService,
    BookService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ClassValidationPipe,
    },
  ],
})
export class ApiModule {}
