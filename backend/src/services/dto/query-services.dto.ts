import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationDto } from '../../common/utils/pagination.util';
import { ServiceCategory } from '../../../generated/prisma/enums';

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
