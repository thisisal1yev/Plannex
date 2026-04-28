import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { QueryEventsDto } from './dto/query-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ORGANIZER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create event (organizer only)' })
  @ApiResponse({ status: 201 })
  create(@CurrentUser('id') organizerId: string, @Body() dto: CreateEventDto) {
    return this.eventsService.create(organizerId, dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List events with filters and pagination' })
  findMany(@Query() query: QueryEventsDto) {
    return this.eventsService.findMany(query);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "List current organizer's own events" })
  getMyEvents(
    @CurrentUser('id') userId: string,
    @Query() query: QueryEventsDto,
  ) {
    return this.eventsService.findMany({ ...query, organizerId: userId });
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get event details' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event (owner only)' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.update(userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel event (owner only)' })
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.eventsService.remove(userId, id);
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish event (owner only)' })
  publish(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.eventsService.publish(userId, id);
  }

  @Get(':id/participants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get event participants (owner only)' })
  getParticipants(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.eventsService.getParticipants(userId, id);
  }
}
