import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do CORS para permitir comunicação com o frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003', 'http://192.168.0.107:3000', 'http://192.168.0.107:3001', 'http://192.168.0.107:3003'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // Configuração do Swagger para documentação da API
  const config = new DocumentBuilder()
    .setTitle('Pokémon Management API')
    .setDescription('API completa para gerenciamento de coleção de Pokémons com integração à PokéAPI')
    .setVersion('1.0.0')
    .setContact(
      'Rodolfo Chicone',
      'https://github.com/rodolfochicone',
      'rodolfo@example.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3333', 'Servidor de Desenvolvimento')
    .addServer('https://api.pokemon-manager.com', 'Servidor de Produção')
    .addTag('pokemon', 'Operações relacionadas aos Pokémons')
    .addTag('auth', 'Operações de autenticação')
    .addTag('health', 'Verificações de saúde da API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Pokémon Management API Docs',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #ff6b6b }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 8px; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      tryItOutEnabled: true,
    },
  });

  const port = process.env.API_PORT || 3333;
  await app.listen(port);
  console.log(`🚀 API Backend rodando na porta ${port}`);
  console.log(`📚 Documentação Swagger disponível em: http://localhost:${port}/api/docs`);
}
bootstrap();
