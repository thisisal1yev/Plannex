import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { PaymentProvider } from '../../../generated/prisma/enums';

export class PurchaseTicketDto {
  @ApiProperty({ description: 'Ticket tier ID' })
  @IsString()
  tierId: string;

  @ApiProperty({ enum: PaymentProvider, description: 'Payment provider' })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;
}
