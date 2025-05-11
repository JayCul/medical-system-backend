import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Req,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LogoutGuard } from 'src/guards/logout.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('create')
  @ApiBody({ type: CreateUserDto })
  // @RequireRoles(Roles.Admin) // Ensure role restriction is specific to this route
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(LogoutGuard)
  @Get('logout')
  @ApiBearerAuth('access-token')
  async logout(@Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    // console.log('Logout Executing')

    if (!token) {
      // console.log('No Token')
      throw new UnauthorizedException('No token provided');

      // return {message: "No token found but logout successful"}
    }

    try {
      await this.authService.logout(token);
      return { message: 'Successfully logged out' };
    } catch (err) {
      console.log('Err Occured');
      if (err.name === 'TokenExpiredError') {
        // console.log('Token Expired Error')
        // Clean up session in Redis even if the token is expired

        const username = this.authService.getUsernameFromExpiredToken(token);
        if (username) {
          await this.authService.removeSession(username);
        }
        return { message: 'Session expired, but logout successful' };
      }
      throw new UnauthorizedException('Invalid or malformed token');
    }
  }

  @Post('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    return req.user;
  }
}
