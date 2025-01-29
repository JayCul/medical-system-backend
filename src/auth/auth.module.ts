import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategies';
import { UserService } from 'src/user/user.service';
import { LogoutGuard } from 'src/guards/logout.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule, // Imported here to provide UserModel to AuthModule
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key101',
      signOptions: { expiresIn: '1h' },
    }),

  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LogoutGuard],
  exports: [AuthService, LogoutGuard],
})
export class AuthModule {}
