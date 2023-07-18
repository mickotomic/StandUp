import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/subscription.entity';
import { Workspace } from 'src/entities/workspace.entity';
import getDateDifference from 'src/helpers/get-date-difference.helper';
import { sendMail } from 'src/helpers/send-mail.helper';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    private mailerService: MailerService,
  ) {}

  @Cron('00 30 12 * * *')
  async paymentChecking() {
    const subscriotions = await this.subscriptionRepository.find({
      where: { status: 'unpaid' },
      relations: ['workspace'],
    });
    subscriotions.forEach((element) => {
      const ownersEmail = element.workspace.owner.email;
      const days = getDateDifference(new Date(), element.createdAt);
      if (days === 12 || days === 13) {
        sendMail(
          ownersEmail,
          'your subscription will be cancelled in 2 days!',
          'workspace-deletion-notice',
          {
            workspaceName: element.workspace.projectName,
            numOfDays: days === 12 ? 2 : 1,
          },
          this.mailerService,
        );
      }
      if (days >= 14 && days <= 16) {
        sendMail(
          ownersEmail,
          'your subscription has been cancelled!',
          'workspace-deletion-confirmed',
          {
            workspaceName: element.workspace.projectName,
          },
          this.mailerService,
        );

        this.workspaceRepository.update({ isActive: false});
      }
    });
  }
}
