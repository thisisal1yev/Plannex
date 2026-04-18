import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Premium Catering Service' })
  @IsString()
  name: string;

  @ApiProperty({ example: '<uuid-of-service-category>' })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 15000000 })
  @IsNumber()
  @Min(0)
  priceFrom: number;

  @ApiProperty({ example: 'Tashkent' })
  @IsString()
  city: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
