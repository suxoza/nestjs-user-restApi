import {
  Controller,
  Get,
  Delete,
  Post,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Injectable,
} from '@nestjs/common';
import { StoreUserDto } from 'src/dto/store-user.dto';
// import { GetUserDto } from 'src/dto/get-user.dto';
import { UserService } from './user.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { RabbitMQService } from 'src/rabbit/rabbit-mq.service';
import { MailService } from 'src/mail/mail.service';
import { diskStorage } from 'multer';

@Injectable()
@Controller('/api/')
export class UserController {
  constructor(
    private userService: UserService,
    private rabbitMQService: RabbitMQService,
    private mailService: MailService,
  ) {}

  @Get('user/:userId')
  async getUser(@Param('userId') userId: string) {
    return await this.userService.getUser(userId);
  }

  /*
  
  * depricated for the time being, due to swagger limitation
  
  @Get('user/:userId')  
  getUser(@Body('userId') user: GetUserDto) {

  }
  */

  @Get('user/:avatar/avatar')
  async getUserByAvatar(@Param('avatar') avatar: string) {
    return await this.userService.getUserByAvatar(avatar);
  }

  @Get('user/:avatarHash/avatarHash')
  async getUserByAvatarHash(@Param('avatarHash') avatarHash: string) {
    return await this.userService.getUserByAvatarHash(avatarHash);
  }

  @Post('users')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './images',
        filename: (_, file, cb) => {
          try {
            const [name, ext] = file.originalname.split('.');
            const fileName = `${name}.${ext}`;
            cb(null, fileName);
          } catch (error) {
            console.error(error);
          }
        },
      }),
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
        name: {
          type: 'string',
          format: 'string',
        },
        email: {
          type: 'string',
          format: 'string',
        },
      },
    },
  })
  async store(@Body() user: StoreUserDto, @UploadedFile() avatar) {
    console.log('testing here....');
    user.set(avatar.originalname);

    // sent rabbitmq queue
    try {
      await this.rabbitMQService.send('some-channel', {
        message: 'some message here',
      });
    } catch (error) {
      console.log('Queue Error!', error);
    }

    // send dummy email
    try {
      await this.mailService.sendUserConfirmation(user.email);
    } catch (error) {
      console.log('Email transmission error');
    }

    return this.userService.create(user);
  }

  @Delete('user/:userId/avatar')
  delete(@Param('userId') userId: string) {
    return this.userService.delete(userId);
  }
}
