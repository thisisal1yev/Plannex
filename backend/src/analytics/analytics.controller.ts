import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Admin platform-wide dashboard statistics' })
  getAdminDashboard() {
    return this.analyticsService.getAdminStats();
  }

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
