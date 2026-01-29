import "dotenv/config"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const express = require('express');
  const path = require('path');
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  await app.listen(Number(process.env.PORT));
  console.log(
    `API is running on: http://localhost:${process.env.PORT}`,
  );
}
bootstrap();
