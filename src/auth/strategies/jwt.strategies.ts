import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key101', // Replace with a more secure key in production
    });
  }

  async validate(payload: any) {
    console.log(payload);
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new Error('Invalid token');
      
    }

    return { _id: payload.sub, username: payload.username, role: payload.role };
  }
}
