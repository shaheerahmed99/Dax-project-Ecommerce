import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgresDatabaseModule } from './database/database';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { JwtService } from '@nestjs/jwt';



@Module({
  imports: [PostgresDatabaseModule, AuthModule, CategoriesModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService ,JwtService,{
    provide: APP_GUARD,
    useClass: AuthGuard,
  }],
})
export class AppModule {}
