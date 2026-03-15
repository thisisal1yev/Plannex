import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentProvider } from '../../../generated/prisma/enums';

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  eventId: string;

  @ApiProperty({ example: 200000 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ enum: PaymentProvider })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tierId?: string;
}
