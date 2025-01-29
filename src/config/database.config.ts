import { registerAs } from '@nestjs/config';

// Redis Configuration
export const redisDBConfig = registerAs('redisDB', () => ({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10), // Ensure port is parsed as a number
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
}));

// JWT Configuration
export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
}));