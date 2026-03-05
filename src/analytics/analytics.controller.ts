import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Organizer dashboard statistics' })
  getDashboard(@CurrentUser('id') userId: string) {
    return this.analyticsService.getDashboardStats(userId);
  }

  @Get('events/:eventId')
  @ApiOperation({
    summary: 'Detailed statistics for a specific event (organizer only)',
  })
  getEventStats(
    @CurrentUser('id') userId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.analyticsService.getEventStats(userId, eventId);
  }
}
