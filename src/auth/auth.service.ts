import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      email: registerDto.email,
      passwordHash,
    });

    return {
      message: 'User registered successfully',
      user: { id: user._id, email: user.email, role: user.role },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user._id.toString(), user.email, user.role);

    await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: { id: user._id, email: user.email, role: user.role },
    };
  }

  async generateTokens(userId: string, email: string, role: string) {
    const accessTokenPayload = { sub: userId, email, role };
    const refreshTokenPayload = { sub: userId, type: 'refresh' };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1h',
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '7d', 
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); 

    await this.usersService.updateRefreshToken(
      userId,
      hashedRefreshToken,
      expiryDate
    );
  }

  async refreshTokens(refreshDto: RefreshDto) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshDto.refresh_token, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Token has been revoked');
      }

      if (user.refreshTokenExpiry && user.refreshTokenExpiry < new Date()) {
        throw new UnauthorizedException('Refresh token expired');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        refreshDto.refresh_token,
        user.refreshToken
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(
        user._id.toString(),
        user.email,
        user.role
      );

      await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null, null);
    return { message: 'Logged out successfully' };
  }
}