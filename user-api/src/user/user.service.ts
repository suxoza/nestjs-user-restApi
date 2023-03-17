import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StoreUserDto } from 'src/dto/store-user.dto';
import { Model } from "mongoose";
import { UserDocument } from 'src/schemas/user.schema';
import fs from 'fs';
import { sharp } from 'sharp'


@Injectable()
export class UserService {

  constructor(@InjectModel('User') private userModel:Model<UserDocument>) { }

  getUser(userId: string) {
    return this.userModel.findById(userId);
  }

  getUserByAvatar(avatar: string ) {
    return this.userModel.find({'avatar': avatar})
  }

  getUserByAvatarHash(avatarHash: string ) {
    return this.userModel.find({'avatarHash': avatarHash})
  }

  async create(req: StoreUserDto) {
    const newStudent = await new this.userModel(req);
    return newStudent.save();
  }

  async delete(userId: string) {
    const user = await this.userModel.findById(userId);
    if(!user)
      throw new Error("User not found!");
    const avatar = user.avatar
    try {
      const status = await fs.unlinkSync(`./images/${avatar}`)
      sharp.cache(false);
    } 
    catch (error) {
      console.log('error = ', error)
    }
    finally{}
    
    return await this.userModel.deleteOne({"_id": userId})
  }
}
