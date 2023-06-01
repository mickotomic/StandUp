import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { User } from '../entities/user.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MailVerificationListener {
  constructor(private readonly authService: AuthService) {}
  @OnEvent('user.created')
  async handleMailSending(user: User) {
    await this.authService.mailVerification(user);
  }
}
