import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('event-categories')
  @Public()
  @ApiOperation({ summary: 'List all event categories' })
  listEventCategories() {
    return this.categoriesService.listEventCategories();
  }

  @Get('service-categories')
  @Public()
  @ApiOperation({ summary: 'List all service categories' })
  listServiceCategories() {
    return this.categoriesService.listServiceCategories();
  }
}
