import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

enum ApplicationStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class UpdateVolunteerApplicationDto {
  @ApiProperty({ enum: ApplicationStatus })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
