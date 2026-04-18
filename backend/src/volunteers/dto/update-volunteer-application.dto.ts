import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { VolunteerRequestStatus } from '../../../generated/prisma/enums';

export class UpdateVolunteerApplicationDto {
  @ApiProperty({ enum: VolunteerRequestStatus, description: 'ACCEPTED or REJECTED' })
  @IsEnum(VolunteerRequestStatus)
  status: VolunteerRequestStatus;
}
