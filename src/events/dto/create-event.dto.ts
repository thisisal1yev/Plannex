import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateTicketTierDto {
  @ApiProperty({ example: 'Standard' })
  @IsString()
  name: string;

  @ApiProperty({ example: 200000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateEventDto {
  @ApiProperty({ example: 'Tech Startup Meetup' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({ example: 'Networking event for entrepreneurs' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/banner.jpg' })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiProperty({ example: '2026-06-15T18:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-06-15T22:00:00Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'Conference' })
  @IsString()
  eventType: string;

  @ApiProperty({ example: 300 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiPropertyOptional({ description: 'Venue ID to associate with the event' })
  @IsOptional()
  @IsString()
  venueId?: string;

  @ApiPropertyOptional({ type: [CreateTicketTierDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketTierDto)
  ticketTiers?: CreateTicketTierDto[];
}
