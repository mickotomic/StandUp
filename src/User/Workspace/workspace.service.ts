import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'src/entities/user-token.entity';
import { UserWorkspace } from 'src/entities/user-workspace.entity';
import { User } from 'src/entities/user.entity';
import { Workspace } from 'src/entities/workspace.entity';
import { emailLogger } from 'src/helpers/winston-logger.helper';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    @InjectRepository(UserWorkspace)
    private readonly userWorkspaceRepository: Repository<UserWorkspace>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  public async inviteUsers(
    id: number,
    invitedEmails: { emails: string },
    user: User,
  ): Promise<void> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    // if (workspace.owner.id !== user.id) {
    //   throw new UnauthorizedException();
    // }
    const arrOfEmails = invitedEmails.emails.split(',');

    const interval = setInterval(() => {
      const emails = arrOfEmails.splice(0, 1);
      emails.forEach(async (email) => {
        const token = [0, 0, 0, 0].reduce((acc) => {
          return acc + Math.floor(Math.random() * 10);
        }, '');
        const link =
          process.env.BASE_URL +
          process.env.APP_PORT +
          `/users/workspaces/${id}/invite?token=${token}&email=${email}`;

        await this.userTokenRepository.save({
          userEmail: email,
          workspace,
          token,
        });

        this.mailerService
          .sendMail({
            to: email,
            from: 'stefan.jeftic122@gmail.com',
            subject: 'You got invitation to join workspace',
            template: 'invitation-email',
            context: {
              link,
              name: user.name,
              workspace: workspace.projectName,
            },
          })
          .then((info) => {
            emailLogger.log({ level: 'info', message: JSON.stringify(info) });
          })
          .catch((err) => {
            emailLogger.log({ level: 'error', message: JSON.stringify(err) });
          });
      });
      if (arrOfEmails.length === 0) {
        clearInterval(interval);
      }
    }, 5000);
  }

  public async verifyInvite(
    id: number,
    email: string,
    token: string,
    user: User,
  ) {
    const userToken = await this.userTokenRepository.findOne({
      where: { token, userEmail: email, workspace: { id } },
    });
    if (!userToken /*&& userToken.userEmail !== user.email */) {
      throw new UnauthorizedException();
    }

    if (user) {
      if (user.emailVerifiedAt === null) {
        user = await this.userRepository.save({
          id: user.id,
          emailVerifiedAt: new Date(),
        });
      }
      await this.userWorkspaceRepository.save({ workspace: { id }, user });

      return { user, workspaceId: id };
    }
  }

  public async checkDoesEmailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email });
    return user ? true : false;
  }
}
