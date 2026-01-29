import { Controller, Get, Patch, Body, Request } from '@nestjs/common';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req: any) {
    const userId = req.headers['user-id'];
    console.log(`[UserController] GET /profile - extracted userId: ${userId}`);
    if (!userId) {
      console.warn('[UserController] User ID missing in headers');
      return { message: 'User ID missing in headers (Simulation)' };
    }
    return this.userService.getProfile(userId);
  }

  @Patch('update')
  async updateProfile(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = req.headers['user-id'];
    if (!userId) {
      return { message: 'User ID missing in headers (Simulation)' };
    }
    return this.userService.updateProfile(userId, updateUserDto);
  }
}
