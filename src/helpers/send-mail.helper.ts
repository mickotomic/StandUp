import { MailerService } from '@nestjs-modules/mailer';
import { emailLogger } from './winston-logger.helper';

export interface MailData {
  email: string;
  subject: string;
  template: string;
  context: object;
  mailerService: MailerService;
  attachments?: { filename: string; path: string }[];
}
export function sendMail(mailData: MailData): Promise<boolean> {
  const {
    email,
    subject,
    template,
    context,
    mailerService,
    attachments = [],
  } = mailData;

  return mailerService
    .sendMail({
      to: email,
      from: process.env.APP_EMAIL,
      subject,
      template,
      context,
      attachments,
    })
    .then((response) => {
      emailLogger.log({
        level: 'info',
        message: JSON.stringify(response),
        type: subject,
      });
      return true;
    })
    .catch((error) => {
      emailLogger.log({
        level: 'error',
        message: JSON.stringify(error),
        type: subject,
      });
      return false;
    });
}
