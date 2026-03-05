import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateVenueDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerDay?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isIndoor?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasWifi?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasParking?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasSound?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasStage?: boolean;
}
