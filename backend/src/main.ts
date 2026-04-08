import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { globalValidationPipe } from './common/pipes/validation-pipe.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(globalValidationPipe);

  // CORS
  const configService = app.get(ConfigService);
  const corsOrigin = configService.get<string>('CORS_FRONTEND_URL', 'http://localhost:5173');
  
  app.enableCors({
    origin: corsOrigin.split(',').map(url => url.trim()), 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Planner AI API')
    .setDescription(
      'Marketplace for event organization in Uzbekistan — events, venues, services, tickets, payments.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(corsOrigin.split(',').map(url => url.trim()))

  console.log(`🚀 Planner AI API running on http://localhost:${port}`);
  console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
}

void bootstrap();
