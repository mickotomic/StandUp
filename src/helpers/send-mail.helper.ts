import { MailDataT } from 'src/types/mail-data.type';
import { emailLogger } from './winston-logger.helper';

export function sendMail(mailData: MailDataT): Promise<boolean> {
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
        message: JSON.stringify(error.message),
        type: subject,
      });
      return false;
    });
}
