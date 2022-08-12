import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(name: string,
                               email: string,
                               token: string) {
        const url = `example.com/auth/confirm?token=${token}`;

        await this.mailerService.sendMail({
            to: email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to Nice App! Confirm your Email',
            template: './confirmation', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                name: name,
                url,
            },
        });
    }

    async sendUserRestorePassword(name: string,
                                  email: string,
                                  token: string) {
        // const url = `example.com/auth/confirm?token=${token}`;
        const url = `http://192.168.0.109:3001/reset/${token}`;

        await this.mailerService.sendMail({
            to: email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to HomeNET Cloud! Reset your password',
            template: './restorePassword', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                name: name,
                url,
            },
        });
    }
}