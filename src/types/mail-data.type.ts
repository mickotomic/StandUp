import { MailerService } from '@nestjs-modules/mailer';

export type MailDataT = {
  email: string;
  subject: string;
  template: string;
  context: ContextT;
  mailerService: MailerService;
  attachments?: { filename: string; path: string }[];
};

export type ContextT = {
  workspaceName?: string,
  numOfDays?: number,
  userName?: string,
  token?: string,
  link?: string,
}