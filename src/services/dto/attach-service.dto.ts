import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class AttachServiceDto {
  @ApiProperty({ example: 'service-uuid-here' })
  @IsString()
  serviceId: string;

  @ApiProperty({ example: 12000000 })
  @IsNumber()
  @Min(0)
  agreedPrice: number;
}
