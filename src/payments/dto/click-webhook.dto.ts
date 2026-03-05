import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ClickWebhookDto {
  @ApiProperty()
  @IsString()
  click_trans_id: string;

  @ApiProperty()
  @IsString()
  merchant_trans_id: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  action: number;

  @ApiProperty()
  @IsString()
  sign_time: string;

  @ApiProperty()
  @IsString()
  sign_string: string;
}
