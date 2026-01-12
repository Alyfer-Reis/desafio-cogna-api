import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './infra/http/exceptions/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new DomainExceptionFilter());
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3333);
}

bootstrap().catch((err) => {
  console.error('Erro durante o bootstrap da aplicação:', err);
  process.exit(1);
});
