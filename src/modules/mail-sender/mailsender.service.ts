import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailSenderService {
  constructor(private mailerService: MailerService) {}

  async informNewMilestone() {
    await this.mailerService.sendMail({
      to: 'hoanhvinh30102001@gmail.com',
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './newMilestone',
      context: {
        context: {
          userName: 'viinh',
          teacher: 'viinh Teacher',
          milestone: '12/03/2023 - 12/03/2024',
          url: 'https://google.com',
        },
      },
    });
    return 'Mail sent'
  }
}
