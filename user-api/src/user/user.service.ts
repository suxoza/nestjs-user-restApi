import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StoreUserDto } from 'src/dto/store-user.dto';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schemas/user.schema';
import fs from 'fs';
import { sharp } from 'sharp';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async getUser(userId: string) {
    try {
      return await this.userModel.findById(userId);
    } catch (error) {
      throw new HttpException('User not found!', HttpStatus.FORBIDDEN);
    }
  }

  async getUserByAvatar(avatar: string) {
    try {
      return this.userModel.find({ avatar: avatar });
    } catch (error) {
      throw new HttpException('User not found!', HttpStatus.FORBIDDEN);
    }
  }

  getUserByAvatarHash(avatarHash: string) {
    try {
      return this.userModel.find({ avatarHash: avatarHash });
    } catch (error) {
      throw new HttpException('User not found!', HttpStatus.FORBIDDEN);
    }
  }

  async create(req: StoreUserDto) {
    try {
      const newStudent = await new this.userModel(req);
      return newStudent.save();
    } catch (error) {
      console.log(error);
      throw new HttpException('Internal Server Error!', HttpStatus.FORBIDDEN);
    }
  }

  async delete(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found!', HttpStatus.FORBIDDEN);
    const avatar = user.avatar;
    try {
      await fs.unlinkSync(`./images/${avatar}`);
      sharp.cache(false);
    } catch (error) {
      console.log('error = ', error);
    }

    return await this.userModel.deleteOne({ _id: userId });
  }
}
