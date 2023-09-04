import { MailerService } from '@nestjs-modules/mailer';
import { emailLogger } from './winston-logger.helper';

// refactor and use object, this is too many args
export function sendMail(
  email: string,
  subject: string,
  template: string,
  context: object,
  mailerService: MailerService,
  attachments: { filename: string; path: string }[] = [],
): Promise<boolean> {
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
