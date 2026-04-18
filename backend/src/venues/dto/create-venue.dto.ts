import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateVenueDto {
  @ApiProperty({ example: 'uuid-of-category' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'Tashkent City Hall' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Amir Temur Avenue 1' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Tashkent' })
  @IsString()
  city: string;

  @ApiPropertyOptional({ example: 41.3115 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 69.2401 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: 500 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 10000000 })
  @IsNumber()
  @Min(0)
  pricePerDay: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isIndoor?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  hasWifi?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  hasParking?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  hasSound?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  hasStage?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
