import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';
import { rmSync } from 'fs';
import { join } from 'path';
import { Workspace } from 'src/entities/workspace.entity';
import { sendMail } from 'src/helpers/send-mail.helper';

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
    if (
      await sendMail(
        job.data.workspace.owner.email,
        'StandUp invoice',
        'invoice-email',
        { projectName: job.data.workspace.projectName },
        this.mailerService,
        [
          {
            filename: 'invoice.pdf',
            path: join(
              process.cwd(),
              `temp/invoice-${job.data.workspace.owner.email}.pdf`,
            ),
          },
        ],
      )
    ) {
      cb(null, 'Completed');
    } else {
      cb(new Error('Faild'), false);
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
