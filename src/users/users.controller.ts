import { Controller, Get, Request, UseGuards, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}