import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: "postgres://neondb_owner:npg_i7aZCyJ4HsPh@ep-solitary-flower-a8h5b8fx-pooler.eastus2.azure.neon.tech/dax-ecommerce-db?sslmode=require",
      autoLoadEntities: true,
      synchronize: true, // Set to `false` in production
      ssl: process.env.DATABASE_URL?.includes('neon.tech')
        ? { rejectUnauthorized: false } // ✅ Enable SSL for NeonDB
        : false,
    }),
  ],
})

export class PostgresDatabaseModule {}