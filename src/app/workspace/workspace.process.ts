import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { MailData, sendMail } from 'src/helpers/send-mail.helper';

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
    const { workspaceName, email, name, link } = job.data;

    const mailData: MailData = {
      email,
      subject: 'Invite to workspace',
      template: 'invitation-email',
      context: {
        link,
        workspaceName,
        name,
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
