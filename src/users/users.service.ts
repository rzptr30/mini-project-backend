import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: { email: string; passwordHash: string; role?: string }) {
    const user = new this.userModel(data);
    return user.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
    expiryDate: Date | null
  ) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        refreshToken: refreshToken,
        refreshTokenExpiry: expiryDate,
      },
      { new: true }
    );
  }
}