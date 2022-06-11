import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidateInputPipe} from "./core/pipes/validate.pipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log']
  });

  // app.setGlobalPrefix('api')

  app.useGlobalPipes(new ValidateInputPipe());
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
