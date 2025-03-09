import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      privateKey: fs.readFileSync(path.join(__dirname, '../../keys/private.pem')),
      publicKey: fs.readFileSync(path.join(__dirname, '../../keys/public.pem')),
      signOptions: { algorithm: 'RS256', expiresIn: '1h' },
    }),
    ConfigModule.forRoot(),
  ],
  providers: [AuthService,EmailService,ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
