import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(userEmail: string) {

    await this.mailerService.sendMail({
        to: userEmail,
        from:"sometestUser@gmail.com",
        subject: 'test subject',
        text: 'content...', 
    });
  }
}
