import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class BookVenueDto {
  @ApiProperty({ example: 'event-uuid-here' })
  @IsString()
  eventId: string;

  @ApiProperty({ example: '2026-06-15T08:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-06-15T23:00:00Z' })
  @IsDateString()
  endDate: string;
}
