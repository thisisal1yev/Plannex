import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ApplyVolunteerDto {
  @ApiProperty({ description: 'ID of the volunteer skill', example: 'uuid' })
  @IsString()
  skillId: string;
}
