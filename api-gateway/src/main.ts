import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Habilitar CORS para que el frontend pueda consumir la API
  app.enableCors();

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api/v1');

  // Configuración de Pipes, Interceptors y Filters globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Epayco Wallet - API Gateway')
    .setDescription(
      'API Gateway para la billetera virtual. Este servicio es el punto de entrada para el cliente.',
    )
    .setVersion('1.0')
    .addTag('Wallet Operations')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`API Gateway is running on: ${await app.getUrl()}`);
  logger.log(`Swagger Docs available at: ${await app.getUrl()}/api-docs`);
}
bootstrap();
