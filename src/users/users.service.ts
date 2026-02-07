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

  async findAll(options: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.email = { $regex: search, $options: 'i' }; 
    }

    const [users, total] = await Promise.all([
      this.userModel
        .find(query)
        .select('-passwordHash -refreshToken -refreshTokenExpiry') 
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(limit)
        .lean(),
      this.userModel.countDocuments(query),
    ]);

    return {
      users,
      total,
    };
  }
}