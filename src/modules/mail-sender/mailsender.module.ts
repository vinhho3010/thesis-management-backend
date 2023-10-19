import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailSenderController } from './mailsender.controller';
import { MailSenderService } from './mailsender.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_ACCOUNT'),
            pass: config.get('MAIL_TOKEN'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_ACCOUNT')}>`,
        },
        template: {
          dir: join(process.cwd(), './src/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailSenderController],
  providers: [MailSenderService],
  exports: [MailSenderService]
})
export class MailSenderModule {}