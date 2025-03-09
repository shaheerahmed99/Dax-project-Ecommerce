import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ||'localhost',
      port: 5432,
      username: process.env.DB_USER||'postgres',
      password: process.env.DB_PASS||'12345',
      database: process.env.DB_NAME||'dax-project',
      entities: [User,Category, Product],
      synchronize: true,
    }),
  ],
})
export class PostgresDatabaseModule {}