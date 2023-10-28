import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailSenderDto } from 'src/dtos/mail-sender/mail-sender';

@Injectable()
export class MailSenderService {
  constructor(private mailerService: MailerService, private configService: ConfigService) {}

  async informNewMilestone(data: MailSenderDto) {
    if(Array.isArray(data.to)) {
      data.to = data.to.join(', ');
    }
    const context = {
      title: data.context.title,
      teacher: data.context.teacher,
      milestone: data.context.milestone,
      url: data.context.url,
    }
    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Mốc thời gian mới vừa được tạo - Hệ thống quản lý luận văn',
      template: './newMilestone',
      context: context,
    });
    console.log(`Mail sent to ${data.to}`);
    return 'Mail sent'
  }

  async informUpdatedMilestone(data: MailSenderDto) {
    if(Array.isArray(data.to)) {
      data.to = data.to.join(', ');
    }
    const context = {
      title: data.context.title,
      teacher: data.context.teacher,
      milestone: data.context.milestone,
      url: data.context.url,
    }
    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Mốc thời gian vừa cập nhật - Hệ thống quản lý luận văn',
      template: './newMilestone',
      context: context,
    });
    console.log(`Mail sent to ${data.to}`);
    return 'Mail sent'
  }

  async informNewCommentThesis(data: MailSenderDto) {
    if(Array.isArray(data.to)) {
      data.to = data.to.join(', ');
    }
    const context = {
      title: data.context.title,
      teacher: data.context.teacher,
      milestone: data.context.milestone,
      url: data.context.url,
    }
    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Nhận xét mới - Hệ thống quản lý luận văn',
      template: './addCommentThesisVersion',
      context: context,
    });
    console.log(`Mail sent to ${data.to}`);
    return 'Mail sent'
  }
}
