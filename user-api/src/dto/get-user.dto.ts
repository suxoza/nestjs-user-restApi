import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Buffer } from 'node:buffer';

export class GetUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
