import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ValidateQrDto {
  @ApiProperty({ description: 'QR code string from the ticket' })
  @IsString()
  qrCode: string;
}
