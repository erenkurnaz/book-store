import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SecurityModule } from '../security/security.module';
import { AccessTokenGuard } from '../security/guards/access-token.guard';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor, AllExceptionsFilter } from './interceptors';
import { AuthenticationController } from './modules/authentication/authentication.controller';
import { AuthenticationService } from './modules/authentication/authentication.service';
import { StoreController } from './modules/store/store.controller';
import { StoreService } from './modules/store/store.service';

@Module({
  imports: [DatabaseModule, SecurityModule],
  controllers: [AuthenticationController, StoreController],
  providers: [
    AuthenticationService,
    StoreService,
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
  ],
})
export class ApiModule {}
