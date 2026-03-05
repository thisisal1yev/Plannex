import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { ValidateQrDto } from './dto/validate-qr.dto';
import { TicketsService } from './tickets.service';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('events/:eventId/tickets/purchase')
  @ApiOperation({ summary: 'Purchase a ticket for an event' })
  purchase(
    @CurrentUser('id') userId: string,
    @Param('eventId') eventId: string,
    @Body() dto: PurchaseTicketDto,
  ) {
    return this.ticketsService.purchase(userId, eventId, dto);
  }

  @Get('tickets/my')
  @ApiOperation({ summary: 'Get current user tickets' })
  getMyTickets(@CurrentUser('id') userId: string) {
    return this.ticketsService.getMyTickets(userId);
  }

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Get ticket details by ID' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }

  @Post('tickets/validate')
  @ApiOperation({ summary: 'Validate ticket by QR code (organizer)' })
  validateQR(@Body() dto: ValidateQrDto) {
    return this.ticketsService.validateQR(dto);
  }
}
