import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
// import { RolesGuard } from './common/guards/roles/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalGuards(new RolesGuard(new Reflector()));
  app.enableCors({
    origin: 'http://localhost:4200', // Adjust to your Angular app's URL
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
