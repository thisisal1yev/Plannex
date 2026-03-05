import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApplyVolunteerDto } from './dto/apply-volunteer.dto';
import { UpdateVolunteerApplicationDto } from './dto/update-volunteer-application.dto';
import { VolunteersService } from './volunteers.service';

@ApiTags('Volunteers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}

  @Post('events/:eventId/volunteers/apply')
  @ApiOperation({ summary: 'Apply as a volunteer for an event' })
  apply(
    @CurrentUser('id') userId: string,
    @Param('eventId') eventId: string,
    @Body() dto: ApplyVolunteerDto,
  ) {
    return this.volunteersService.apply(userId, eventId, dto);
  }

  @Get('events/:eventId/volunteers')
  @ApiOperation({
    summary: 'List volunteer applications for an event (organizer only)',
  })
  getEventApplications(
    @CurrentUser('id') userId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.volunteersService.getEventApplications(userId, eventId);
  }

  @Patch('events/:eventId/volunteers/:applicationId')
  @ApiOperation({
    summary: 'Accept or reject volunteer application (organizer only)',
  })
  updateApplication(
    @CurrentUser('id') userId: string,
    @Param('eventId') eventId: string,
    @Param('applicationId') applicationId: string,
    @Body() dto: UpdateVolunteerApplicationDto,
  ) {
    return this.volunteersService.updateApplication(
      userId,
      eventId,
      applicationId,
      dto,
    );
  }

  @Get('volunteers/my')
  @ApiOperation({ summary: 'Get my volunteer applications' })
  getMyApplications(@CurrentUser('id') userId: string) {
    return this.volunteersService.getMyApplications(userId);
  }
}
