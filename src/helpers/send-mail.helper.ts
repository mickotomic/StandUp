import { MailerService } from '@nestjs-modules/mailer';
import { emailLogger } from './winston-logger.helper';

export function sendMail(
  email: string,
  subject: string,
  template: string,
  context: object,
  mailerService: MailerService,
): Promise<boolean> {
  return mailerService
    .sendMail({
      to: email,
      from: process.env.APP_EMAIL,
      subject,
      template,
      context,
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
