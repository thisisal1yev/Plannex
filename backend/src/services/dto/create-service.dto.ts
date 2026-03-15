import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ServiceCategory } from '../../../generated/prisma/enums';

export class CreateServiceDto {
  @ApiProperty({ example: 'Premium Catering Service' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ServiceCategory })
  @IsEnum(ServiceCategory)
  category: ServiceCategory;

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
