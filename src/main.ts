import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
// import { RolesGuard } from './common/guards/roles/roles.guard';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RolesGuard } from './guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new RolesGuard(new Reflector()));
  // app.useGlobalFilters(new HttpErrorFilter());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Hospital Management System API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token', // This name will be referenced below (security specification)
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
