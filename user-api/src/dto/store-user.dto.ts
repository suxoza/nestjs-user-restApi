import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Buffer } from 'node:buffer';

export class StoreUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  avatar: string;
  avatarHash: string;
  date_added: number;
  
  set(avatar: string) {
    this.avatar = avatar
    this.avatarHash = Buffer.from(avatar).toString('base64');
    this.date_added = Math.round(Number(new Date().getTime() / 1000))
  }
}
