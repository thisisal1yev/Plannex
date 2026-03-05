import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { BookVenueDto } from './dto/book-venue.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreateVenueDto } from './dto/create-venue.dto';
import { QueryVenuesDto } from './dto/query-venues.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { VenuesService } from './venues.service';

@ApiTags('Venues')
@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new venue (admin or vendor)' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateVenueDto) {
    return this.venuesService.create(userId, dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List venues with filters' })
  findMany(@Query() query: QueryVenuesDto) {
    return this.venuesService.findMany(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get venue details' })
  findOne(@Param('id') id: string) {
    return this.venuesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update venue (owner)' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateVenueDto,
  ) {
    return this.venuesService.update(userId, id, dto);
  }

  @Post(':id/book')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Book venue for an event' })
  book(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: BookVenueDto,
  ) {
    return this.venuesService.book(userId, id, dto);
  }

  @Get(':id/availability')
  @Public()
  @ApiOperation({ summary: 'Check venue availability for dates' })
  checkAvailability(
    @Param('id') id: string,
    @Query() dto: CheckAvailabilityDto,
  ) {
    return this.venuesService.checkAvailability(id, dto);
  }
}
