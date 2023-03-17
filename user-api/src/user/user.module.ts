import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RabbitMQModule } from 'src/rabbit/rabbit-mq.module';
import { MailModule } from 'src/mail/mail.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.schema';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    RabbitMQModule, 
    MailModule,

    MongooseModule.forRoot('mongodb://mongo_server:27017/test_db'),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
})
export class UserModule {}
