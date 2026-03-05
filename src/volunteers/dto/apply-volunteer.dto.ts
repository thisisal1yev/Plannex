import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class ApplyVolunteerDto {
  @ApiProperty({ type: [String], example: ['registration', 'translation'] })
  @IsArray()
  @IsString({ each: true })
  skills: string[];
}
