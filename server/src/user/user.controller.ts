import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

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

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.headers['user-id'];
    if (!userId) {
      throw new BadRequestException('User ID missing');
    }
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.userService.uploadProfileImage(userId, file);
  }
}
