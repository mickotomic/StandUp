import { MailerService } from '@nestjs-modules/mailer';
<<<<<<< HEAD
=======
import { InjectQueue } from '@nestjs/bull';
>>>>>>> dev
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { SubscriptionItems } from 'src/entities/subscription-items.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { Workspace } from 'src/entities/workspace.entity';
import calculateSubscriptionPrice from 'src/helpers/calculate-subscription-price.helper';
import { generatePDF } from 'src/helpers/generate-pdf-invoice.helper';
import getDateDifference from 'src/helpers/get-date-difference.helper';
import { sendMail } from 'src/helpers/send-mail.helper';
import { Repository } from 'typeorm';

@Injectable()
export class CronSubscriptionService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionItems)
    private readonly subscriptionItemsRepository: Repository<SubscriptionItems>,
    private mailerService: MailerService,
<<<<<<< HEAD
=======
    @InjectQueue('invoice-email') private readonly mailerQueue: Queue,
>>>>>>> dev
  ) {}

  @Cron('0 0 4 * * *')
  async checkWorkspaceSubscription() {
    const workspaces = await this.workspaceRepository.find({
      where: { isActive: true },
      relations: { owner: true, subscriptions: true, users: true },
    });

    for (let i = 0; i < workspaces.length; i++) {
      if (
        workspaces[i].users.length < 5 ||
        getDateDifference(new Date(), workspaces[i].createdAt) < 30
      ) {
        continue;
      }
      workspaces[i].subscriptions.sort((a, b) => {
        return a.id - b.id;
      });
      const lastSubscription =
        workspaces[i].subscriptions[workspaces[i].subscriptions.length - 1];
      if (
        lastSubscription &&
        (lastSubscription.status !== 'paid' ||
          new Date().getMonth() === lastSubscription.createdAt.getMonth())
      ) {
        continue;
      }
      const pricePerUser = calculateSubscriptionPrice(
        workspaces[i].users.length,
      );
      const subscription = await this.subscriptionRepository.save({
        workspace: { id: workspaces[i].id },
        numberOfActiveUsers: workspaces[i].users.length,
        price: pricePerUser * workspaces[i].users.length,
      });

      this.subscriptionItemsRepository.save({
        price: pricePerUser,
        subscription: { id: subscription.id },
        user: { id: workspaces[i].owner.id },
      });
      this.sendInvoiceEmail(workspaces[i], subscription, pricePerUser);
    }
  }

  @Cron('0 0 5 * * *')
  async paymentChecking() {
    const subscription = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.workspace', 'workspace')
      .leftJoinAndSelect('workspace.owner', 'owner')
      .where('workspace.isActive = :isActive ', { isActive: true })
      .andWhere('subscription.status <> :status', { status: 'paid' })
      .getMany();

<<<<<<< HEAD
    for (let i = 0; i < subscription.length; i++) {
=======
    for (let i = 0; i >= subscription.length; i++) {
>>>>>>> dev
      const ownersEmail = subscription[i].workspace.owner.email;
      const days = Math.floor(
        getDateDifference(new Date(), subscription[i].createdAt),
      );
<<<<<<< HEAD
      const numberOfDays = days === 12 ? 2 : 1;
=======
      const numberOfDays = 12 ? 2 : 1;
>>>>>>> dev
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
<<<<<<< HEAD
          'Your workspace has been blocked',
=======
          'your subscription has been cancelled!',
>>>>>>> dev
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
<<<<<<< HEAD
=======

  async sendInvoiceEmail(
    workspace: Workspace,
    subscription: Subscription,
    pricePerUser: number,
  ) {
    generatePDF(workspace, workspace.owner, subscription, pricePerUser);

    await this.mailerQueue.add(
      'invoiceEmail',
      {
        workspace,
      },
      {
        attempts: +process.env.QUEUES_NUMBER_OF_ATTEMPTS,
        backoff: {
          type: process.env.QUEUES_BACKOFF_TYPE,
          delay: +process.env.QUEUES_BACKOFF_DELAY,
        },
      },
    );
  }
>>>>>>> dev
}
