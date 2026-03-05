import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CheckAvailabilityDto {
  @ApiProperty({ example: '2026-06-15T08:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-06-15T23:00:00Z' })
  @IsDateString()
  endDate: string;
}
