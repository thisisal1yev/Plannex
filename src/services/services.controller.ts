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
import { AttachServiceDto } from './dto/attach-service.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { QueryServicesDto } from './dto/query-services.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@ApiTags('Services')
@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post('services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new service (admin or vendor)' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateServiceDto) {
    return this.servicesService.create(userId, dto);
  }

  @Get('services')
  @Public()
  @ApiOperation({ summary: 'List services with filters' })
  findMany(@Query() query: QueryServicesDto) {
    return this.servicesService.findMany(query);
  }

  @Get('services/:id')
  @Public()
  @ApiOperation({ summary: 'Get service details' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch('services/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'VENDOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service' })
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.servicesService.update(id, dto);
  }

  @Post('events/:eventId/services')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Attach a service to an event' })
  attachToEvent(
    @Param('eventId') eventId: string,
    @Body() dto: AttachServiceDto,
  ) {
    return this.servicesService.attachToEvent(eventId, dto);
  }

  @Get('events/:eventId/services')
  @Public()
  @ApiOperation({ summary: 'Get services attached to an event' })
  getEventServices(@Param('eventId') eventId: string) {
    return this.servicesService.getEventServices(eventId);
  }
}
