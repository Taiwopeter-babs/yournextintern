import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ICorsConfig } from './lib/types';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  console.log(`${configService.get('NODE_ENV')} hhshsh`);

  // cors config
  const corsConfig = configService.get<ICorsConfig>('CORS_OPTIONS');
  app.enableCors(corsConfig);

  // global path prefix and versioning
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v1',
  });

  // global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // get config
  const port = configService.get('PORT') || 3001;

  await app.listen(port);
}

bootstrap();
