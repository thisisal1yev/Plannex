import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationDto } from '../../common/utils/pagination.util';

enum ServiceCategory {
  CATERING = 'CATERING',
  DECORATION = 'DECORATION',
  SOUND = 'SOUND',
  PHOTO = 'PHOTO',
  SECURITY = 'SECURITY',
}

export class QueryServicesDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ServiceCategory })
  @IsOptional()
  @IsEnum(ServiceCategory)
  category?: ServiceCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
