import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { sendMail } from 'src/helpers/send-mail.helper';
import { MailDataT } from 'src/types/mail-data.type';

@Processor('workspace')
export class WorkspaceProcess {
  constructor(private readonly mailerService: MailerService) {}

  @Process('inviteEmail')
  public async sendInviteEmail(
    job: Job<{
      workspaceName: string;
      email: string;
      name: string;
      link: string;
    }>,
    cb: DoneCallback,
  ) {
    const { workspaceName, email, link } = job.data;

    const mailData: MailDataT = {
      email,
      subject: 'Invite to workspace',
      template: 'invitation-email',
      context: {
        link,
        workspaceName,
        userName: job.data.name,
      },
      mailerService: this.mailerService,
    };

    if (await sendMail(mailData)) {
      cb(null, 'Completed');
    } else {
      cb(new Error('Failed'), false);
    }
  }
}
