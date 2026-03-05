import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ClickWebhookDto } from './dto/click-webhook.dto';
import { PaymeWebhookDto } from './dto/payme-webhook.dto';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('click/webhook')
  @Public()
  @ApiOperation({ summary: 'Click payment webhook' })
  clickWebhook(@Body() dto: ClickWebhookDto) {
    return this.paymentsService.handleClickWebhook(dto);
  }

  @Post('payme/webhook')
  @Public()
  @ApiOperation({ summary: 'Payme payment webhook (JSON-RPC 2.0)' })
  paymeWebhook(@Body() dto: PaymeWebhookDto) {
    return this.paymentsService.handlePaymeWebhook(dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user payment history' })
  getMyPayments(@CurrentUser('id') userId: string) {
    return this.paymentsService.getMyPayments(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment details' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }
}
