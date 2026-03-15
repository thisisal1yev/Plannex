import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { VolunteerStatus } from '../../../generated/prisma/enums';

export class UpdateVolunteerApplicationDto {
  @ApiProperty({ enum: VolunteerStatus, description: 'ACCEPTED or REJECTED' })
  @IsEnum(VolunteerStatus)
  status: VolunteerStatus;
}
