import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { rmSync } from 'fs';
import { join } from 'path';
import { Workspace } from 'src/entities/workspace.entity';
import { MailData, sendMail } from 'src/helpers/send-mail.helper';

@Processor('invoice-email')
export class CronSubscriptionProcess {
  constructor(private readonly mailerService: MailerService) {}

  @Process('invoiceEmail')
  public async sendInvoiceEmail(
    job: Job<{
      workspace: Workspace;
    }>,
    cb: DoneCallback,
  ) {
    const mailData: MailData = {
      email: job.data.workspace.owner.email,
      subject: 'StandUp invoice',
      template: 'invoice-email',
      context: {
        projectName: job.data.workspace.projectName,
      },
      mailerService: this.mailerService,
      attachments: [
        {
          filename: 'invoice.pdf',
          path: join(
            process.cwd(),
            `temp/invoice-${job.data.workspace.owner.email}.pdf`,
          ),
        },
      ],
    };

    if (await sendMail(mailData)) {
      cb(null, 'Completed');
    } else {
      cb(new Error('Failed'), false);
    }
  }

  @OnQueueCompleted({ name: 'invoiceEmail' })
  removePdfFile(
    job: Job<{
      workspace: Workspace;
    }>,
  ) {
    rmSync(
      join(process.cwd(), `temp/invoice-${job.data.workspace.owner.email}.pdf`),
    );
  }
}
