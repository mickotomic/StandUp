import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';

@Injectable()
@Processor('email')
export class WorkspaceProcessor {
  private readonly logger = new Logger(WorkspaceProcessor.name);
  constructor(private readonly mailerService: MailerService) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @Process('test')
  async email(job: Job<{ email: string; link: string; name: string }>) {
    console.log('ulazi');
    this.logger.debug(job.data);
    try {
      await this.mailerService
        .sendMail({
          to: job.data.email,
          from: 'stefan.jeftic122@gmail.com',
          subject: 'You got invitation to join workspace',
          template: 'invitation-email',
          context: { link: job.data.link, name: job.data.name },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.error(err);
    }
  }
}
