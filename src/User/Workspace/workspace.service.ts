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
  ): Promise<void> {
    const workspace = await this.workspaceRepository.findOneBy({ id });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
    // const owner = await this.userRepository.findOneBy({ id: user.id });
    // if (workspace.owner.id !== owner.id) {
    //   throw new UnauthorizedException();
    // }
    const arrOfEmails = invitedEmails.emails.split(',');

    arrOfEmails.forEach(async (email) => {
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
          context: { link, name: 'test' },
        })
        .then((info) => {
          console.log(info);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  public async verifyInvite(
    id: number,
    email: string,
    token: string,
    // user: User,
  ) {
    const userToken = await this.userTokenRepository.findOne({
      where: { token, userEmail: email, workspace: { id } },
    });
    if (!userToken /*&& userToken.userEmail !== loggedUser.email */) {
      throw new UnauthorizedException();
    }

    // if (user) {
    //   if (user.emailVerifiedAt === null) {
    //     this.userRepository.update(user.id, {
    //       emailVerifiedAt: new Date(),
    //     });
    //   }
    //   await this.userWorkspaceRepository.save({ workspace: { id }, user });
    //
    //   return { user, workspaceId: id };
    // }
  }

  public async checkDoesEmailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      return true;
    }
    return false;
  }
}
