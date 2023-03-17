import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [UserModule, MailModule],
  providers: [MailService],
})
export class AppModule {}
