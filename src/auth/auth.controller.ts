import { Body, Controller, Post, ValidationPipe, HttpCode, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body(ValidationPipe) refreshDto: RefreshDto) {
    return this.authService.refreshTokens(refreshDto);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}