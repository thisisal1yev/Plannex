import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiPropertyOptional({ description: 'Event ID to review' })
  @IsOptional()
  @IsString()
  eventId?: string;

  @ApiPropertyOptional({ description: 'Square ID to review' })
  @IsOptional()
  @IsString()
  squareId?: string;

  @ApiPropertyOptional({ description: 'Service ID to review' })
  @IsOptional()
  @IsString()
  serviceId?: string;

  @ApiProperty({ minimum: 1, maximum: 5, example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: 'Excellent experience!' })
  @IsOptional()
  @IsString()
  comment?: string;
}
