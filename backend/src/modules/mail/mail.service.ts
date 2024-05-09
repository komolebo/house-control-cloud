import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    FRONTEND_URL = process.env.FRONTEND_URL;

    constructor(private mailerService: MailerService) {}

    async sendUserAccountActivation(name: string,
                                    email: string,
                                    token: string) {
        const url = `${this.FRONTEND_URL}/activate/${token}`;

        await this.mailerService.sendMail({
            to: email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to HomeNET Cloud! Activate your account',
            template: './accountConfirmation', // `.hbs` extension is appended automatically
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
        const url = `${this.FRONTEND_URL}/reset/${token}`;

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