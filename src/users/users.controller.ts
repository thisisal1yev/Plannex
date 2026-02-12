import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Body,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

// TODO: real auth guard qo‘shiladi
// Hozir demo uchun userId va role ni qo‘lda uzatyapmiz

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Admin — user list
  @Get()
  findMany(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findMany({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
    });
  }

  // Self profile
  @Get('me')
  getProfile() {
    const userId = 'USER_ID_FROM_AUTH';
    return this.usersService.getProfile(userId);
  }

  // Get by id (admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // Update own profile
  @Patch('me')
  updateSelf(@Body() dto: UpdateUserDto) {
    const userId = 'USER_ID_FROM_AUTH';
    return this.usersService.updateSelf(userId, dto);
  }

  // Admin update user
  @Patch(':id')
  updateByAdmin(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const adminRole = 'ADMIN' as any;
    return this.usersService.updateByAdmin(adminRole, id, dto);
  }

  // Admin delete
  @Delete(':id')
  remove(@Param('id') id: string) {
    const adminRole = 'ADMIN' as any;
    return this.usersService.remove(adminRole, id);
  }
}
