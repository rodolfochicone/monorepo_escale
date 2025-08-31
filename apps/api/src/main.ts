import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do CORS para permitir comunicação com o frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://192.168.0.107:3000', 'http://192.168.0.107:3001'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.API_PORT || 3333;
  await app.listen(port);
  console.log(`🚀 API Backend rodando na porta ${port}`);
}
bootstrap();
