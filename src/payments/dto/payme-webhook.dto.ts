import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class PaymeWebhookDto {
  @ApiProperty()
  @IsString()
  method: string;

  @ApiProperty()
  @IsObject()
  params: Record<string, any>;

  @ApiProperty()
  id: number | string;
}
