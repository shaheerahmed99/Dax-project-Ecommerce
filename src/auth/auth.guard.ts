import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    ForbiddenException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  // import { jwtConstants } from './constants';
  import { Request } from 'express';
  import { Reflector } from '@nestjs/core'; // Import reflector to check metadata
  import { IS_ADMIN_KEY, IS_CUSTOMER_KEY,IS_PUBLIC_KEY } from '../decorators/is-roles.decorator'; // Import custom keys
  import * as fs from 'fs';
  import * as path from 'path';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    private publicKey: string;
    constructor(private jwtService: JwtService, private reflector: Reflector) {
      this.publicKey = fs.readFileSync(path.resolve('keys/public.pem'), 'utf8');
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      const isAdminRequired = this.reflector.get<boolean>(IS_ADMIN_KEY, context.getHandler());
      const isCustomerRequired = this.reflector.get<boolean>(IS_CUSTOMER_KEY, context.getHandler());
      if (isPublic) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      // console.log("token:",token)
      const cert = this.publicKey;
      if (!cert) {
        throw new Error('Token generation failure');
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            publicKey:cert
          }
          
        );

        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
        // console.log('Decoded JWT payload:', payload);
         // Check if the route requires admin or customer permissions
      

      // If the route requires admin access
      if (isAdminRequired && payload.isAdmin ==false) {
        throw new ForbiddenException('You must be an admin to access this route');
      }

      // If the route requires customer access
      if (isCustomerRequired && payload.isAdmin) {
        throw new ForbiddenException('Admins cannot access customer routes');
      }
      

      } catch(error) {
        // console.error('Error during token verification:', error);
        if (error instanceof ForbiddenException) {
          throw error;  // Let NestJS handle it
        }
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }