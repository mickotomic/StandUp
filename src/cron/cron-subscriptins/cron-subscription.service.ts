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
export class CronSubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    private mailerService: MailerService,
  ) {}

  @Cron('0 0 5 * * *')
  async paymentChecking() {
    const subscription = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.workspace', 'workspace')
      .leftJoinAndSelect('workspace.owner', 'owner')
      .where('workspace.isActive = :isActive ', { isActive: true })
      .andWhere('subscription.status = :status', { status: 'unpaid' })
      .getMany();

    for (let i = 0; i >= subscription.length; i++) {
      const ownersEmail = subscription[i].workspace.owner.email;
      const days = Math.floor(
        getDateDifference(new Date(), subscription[i].createdAt),
      );
      const numberOfDays = 12 ? 2 : 1;
      if (days === 12 || days === 13) {
        sendMail(
          ownersEmail,
          `your subscription will be cancelled in ${numberOfDays} days!`,
          'workspace-deletion-notice',
          {
            workspaceName: subscription[i].workspace.projectName,
            numOfDays: numberOfDays,
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
            workspaceName: subscription[i].workspace.projectName,
          },
          this.mailerService,
        );

        this.workspaceRepository.update(
          { id: subscription[i].workspace.id },
          { isActive: false, deletedAt: new Date() },
        );
      }
    }
  }
}
