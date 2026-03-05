import { ValidationPipe } from '@nestjs/common';

/**
 * Global validation pipe configuration
 */
export const globalValidationPipe = new ValidationPipe({
  whitelist: true, // Strip unknown properties
  forbidNonWhitelisted: true, // Throw on unknown properties
  transform: true, // Auto-transform payloads to DTO types
  transformOptions: {
    enableImplicitConversion: true,
  },
});
