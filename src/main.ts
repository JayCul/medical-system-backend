import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
// import { RolesGuard } from './common/guards/roles/roles.guard';
import { HttpErrorFilter } from './common/filters/http-error.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalGuards(new RolesGuard(new Reflector()));
  app.useGlobalFilters(new HttpErrorFilter())
  app.enableCors({
    origin: 'http://localhost:4200', // Adjust to your Angular app's URL
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
 