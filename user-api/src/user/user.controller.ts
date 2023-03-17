import {
  Controller,
  Get,
  Delete,
  Post,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StoreUserDto } from 'src/dto/store-user.dto';
import { UserService } from './user.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { RabbitMQService } from 'src/rabbit/rabbit-mq.service';
import { MailService } from 'src/mail/mail.service';
import { diskStorage } from 'multer';

@Controller('/api/')
export class UserController {
  constructor(
    private userService: UserService,
    private rabbitMQService: RabbitMQService,
    private mailService: MailService
  ) {}

  @Get('user/:userId')  
  getUser(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }

  @Get('user/:avatar/avatar')
  getUserByAvatar(@Param('avatar') avatar: string) {
    return this.userService.getUserByAvatar(avatar);
  }

  @Get('user/:avatarHash/avatarHash')
  getUserByAvatarHash(@Param('avatarHash') avatarHash: string) {
    return this.userService.getUserByAvatar(avatarHash);
  }

  @Post('user')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar',  {
    storage: diskStorage({
      destination: './images',
      filename: (_, file, cb) => {
        try {
          const [ name, ext ] = file.originalname.split('.')
          const fileName = `${name}.${ext}`
          cb(null, fileName)
        } catch (error) {
          console.error(error)
        } 
      }
    })
  }))
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
  async store(
    @Body() user: StoreUserDto,
    @UploadedFile() avatar,
  ) {
    user.set(avatar.originalname)
    
    // sent rabbitmq queue
    this.rabbitMQService.send('some-channel', {
      message: 'some message here',
    });

    // send dummy email
    try {
      await this.mailService.sendUserConfirmation(user.email)
    } catch (error) {
      console.log('Email transmission error')
    }

    return this.userService.create(user);
  }

  @Delete('user/:userId')
  delete(@Param('userId') userId: string ) {
    return this.userService.delete(userId);
  }
}
