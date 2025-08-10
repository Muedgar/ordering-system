/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(new Reflector()),
    new ResponseInterceptor(new Reflector()),
  );
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Papa Mama Shop')
    .setDescription('Papa Mama Shop Documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
