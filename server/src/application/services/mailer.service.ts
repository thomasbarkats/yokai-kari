import { ConfigService, Injectable, LoggerService } from 'yasui';
import nodemailer, { SentMessageInfo } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { size, toNumber } from 'lodash';


@Injectable()
export class MailerService {
    private transporter!: Mail;

    constructor(
        private logger: LoggerService,
    ) {
        this.configure();
    }


    public async send(
        receiver: string,
        subject: string,
        text: string,
    ): Promise<void> {
        this.logger.start();
        const mail: SentMessageInfo = await this.transporter.sendMail({
            from: `"${ConfigService.get('NAME')}" <noreply@${ConfigService.get('DOMAIN')}>`,
            to: receiver,
            subject,
            text,
        });
        this.logger.success(`mail sent to ${mail.accepted}`, MailerService.name);
        if (size(mail.rejected) > 0) {
            this.logger.warn(`mail rejected for ${mail ? mail.accepted : []}`, MailerService.name);
        }
    }


    private async configure(): Promise<void> {
        let user: string = ConfigService.get('SMTP_AUTH_USER');
        let pass: string = ConfigService.get('SMTP_AUTH_PASS');

        if (ConfigService.get('ENV') === 'development') {
            const testAccount: nodemailer.TestAccount = await nodemailer.createTestAccount();
            user = testAccount.user;
            pass = testAccount.pass;
        }

        this.transporter = nodemailer.createTransport({
            host: ConfigService.get('SMTP_HOST'),
            port: toNumber(ConfigService.get('SMTP_HOST')),
            secure: false,
            auth: { user, pass },
        });
    }
}
