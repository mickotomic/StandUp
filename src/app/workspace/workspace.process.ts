import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { emailLogger } from 'src/helpers/winston-logger.helper';

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
    this.mailerService
      .sendMail({
        from: process.env.APP_EMAIL,
        to: job.data.email,
        template: 'invitation-email',
        context: {
          link: job.data.link,
          workspace: job.data.workspaceName,
          name: job.data.name,
        },
      })
      .then((response) => {
        emailLogger.log({ level: 'info', message: JSON.stringify(response) });
      })
      .catch((error) => {
        emailLogger.log({ level: 'error', message: JSON.stringify(error) });
      });
  }
}
