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

  @Cron('0 0 4 * * *')
  async paymentChecking() {
    const subscriotions = await this.subscriptionRepository.find({
      where: { status: 'unpaid' },
      relations: {workspace: {owner: true}},
    });
    subscriotions.forEach((subscription) => {
      console.log(subscription)
      const ownersEmail = subscription.workspace.owner.email;
      const days = Math.floor(getDateDifference(new Date(), subscription.createdAt));
      console.log(days)
      if (days === 12 || days === 13) {
        sendMail(
          ownersEmail,
          `your subscription will be cancelled in ${(days === 12 ? 2:1)}  days!`,
          'workspace-deletion-notice',
          {
            workspaceName: subscription.workspace.projectName,
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
            workspaceName: subscription.workspace.projectName,
          },
          this.mailerService,
        );

        this.workspaceRepository.update( {id: subscription.id} ,  {isActive: false})
      }
    });
  }
}
