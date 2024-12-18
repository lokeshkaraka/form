import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

const cors = require('cors');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Emailer Bot')
    .setDescription('The Bot API description')
    .setVersion('1.0')
    .addTag('Emailer Bot Swagger Ui')
    .build();

  app.use(cors());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3001);
  Logger.log(
    `🚀 Application is running on: http://localhost:3001/api`
  );
}

bootstrap();