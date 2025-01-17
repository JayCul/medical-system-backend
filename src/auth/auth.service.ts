import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';
import { User } from 'src/user/schemas/user.schema';
import { Console } from 'console';

@Injectable()
export class AuthService {
  private redisClient = new Redis();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // const activeToken = await this.redisClient.get(username);
      if (await this.isSessionActive(username)) {
        throw new UnauthorizedException(`${username} is already logged in`);
      }
      
      if (!user.isActive){
        throw new UnauthorizedException(`${username} has been deactivated`);

      }

      const utcPlusOne = new Date();
      utcPlusOne.setHours(utcPlusOne.getUTCHours() + 1);

      // let lastLogin = utcPlusOne.toISOString();
      // new Date((new Date()).getTime() + 60 * 60 * 1000);
      user.lastLogin = utcPlusOne;
      user.save();
      // console.log(lastLogin)
      const { password, ...result } = user.toObject(); // Exclude password in response
      return result;
    }
    return null;
  }

  async isSessionActive(username: string): Promise<boolean> {
    const activeToken = await this.redisClient.get(username);
    return !!activeToken; // Returns true if an active token exists
  }

  getUsernameFromExpiredToken(token: string): string | null {
    try {
      const decoded = this.jwtService.decode(token) as { username: string };
      // console.log(decoded);
      return decoded?.username || null;
    } catch (error) {
      return null; // Token is invalid or cannot be decoded
    }
  }

  async removeSession(username: string): Promise<void> {
    await this.redisClient.del(username); // Clean up Redis session
  }
  
  

  async logout(token: string): Promise<void> {
    try {
      const decoded = this.jwtService.verify(token); // Verifies and decodes the token
      const username = decoded.username;
  
      if (!username) {
        throw new UnauthorizedException('Invalid token');
      }
  
      await this.redisClient.del(username); // Remove token from Redis
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw error; // Let the controller handle expired tokens
      }
      throw new UnauthorizedException('Invalid or malformed token');
    }
  }
  
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { username: user.username, sub: user._id, role: user.role };
    const token = this.jwtService.sign(payload);
    const message = "Sign in successful"
    // Save token to Redis with 1-hour expiration
    await this.redisClient.set(username, token, 'EX', 3600);

    return {
      access_token: token,
      user,
      message
    };
  }
}
