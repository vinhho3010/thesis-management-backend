import { Controller, Get } from '@nestjs/common';
import { MailSenderService } from './mailsender.service';

@Controller('api/email')
export class MailSenderController {
    constructor(private mailService: MailSenderService) {}

    @Get()
    async informNewMilestone() {
        return this.mailService.informNewMilestone();
    }
}
