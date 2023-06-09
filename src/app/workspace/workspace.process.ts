import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { sendMail } from 'src/helpers/send-mail.helper';

@Processor('workspace')
export class WorkspaceProcess {
  constructor(private readonly mailerService: MailerService) {}

  @Process('inviteEmail')
  public sendInviteEmail(
    job: Job<{
      workspaceName: string;
      email: string;
      name: string;
      link: string;
    }>,
  ) {
    sendMail(
      job.data.email,
      'Invite to workspace',
      'invitation-email',
      {
        link: job.data.link,
        workspace: job.data.workspaceName,
        name: job.data.name,
      },
      this.mailerService,
    );
  }
}
