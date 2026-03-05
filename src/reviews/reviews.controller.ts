import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewsDto } from './dto/query-reviews.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review for a venue, service, or event' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(userId, dto);
  }

  @Get('venues/:id/reviews')
  @Public()
  @ApiOperation({ summary: 'Get reviews for a venue' })
  getVenueReviews(@Param('id') id: string, @Query() query: QueryReviewsDto) {
    return this.reviewsService.getVenueReviews(id, query);
  }

  @Get('services/:id/reviews')
  @Public()
  @ApiOperation({ summary: 'Get reviews for a service' })
  getServiceReviews(@Param('id') id: string, @Query() query: QueryReviewsDto) {
    return this.reviewsService.getServiceReviews(id, query);
  }

  @Get('events/:id/reviews')
  @Public()
  @ApiOperation({ summary: 'Get reviews for an event' })
  getEventReviews(@Param('id') id: string, @Query() query: QueryReviewsDto) {
    return this.reviewsService.getEventReviews(id, query);
  }
}
