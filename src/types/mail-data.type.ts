import { MailerService } from '@nestjs-modules/mailer';

export type MailDataT = {
  email: string;
  subject: string;
  template: string;
  context: object;
  mailerService: MailerService;
  attachments?: { filename: string; path: string }[];
};
