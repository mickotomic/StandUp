import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { returnMessages } from 'src/helpers/error-message-mapper.helper';
import { GooglePayload } from 'src/types/google-auth-payload.type';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ValidationCode } from '../entities/validation-code.entity';
import { VerificationCodeDto } from './dto/code-verification.dto';
import { LoginDto } from './dto/loginUser.dto';
import { RegenerateCodeDto } from './dto/regenerate-code.dto';
import { UserDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    private mailerService: MailerService,
    @InjectRepository(ValidationCode)
    private validationCodeRepository: Repository<ValidationCode>,
  ) {}

  async register(createUserDto: UserDto) {
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (user) {
      throw new BadRequestException(returnMessages.EmailInUse);
    }
    const preparedUser = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const newUser = await this.userRepository.save(preparedUser);
    if (newUser) {
      if (createUserDto.verifiedEmail === newUser.email) {
        await this.userRepository.update(newUser.id, {
          emailVerifiedAt: new Date(),
        });
        return this.login({
          email: createUserDto.email,
          password: createUserDto.password,
        });
      }
      this.eventEmitter.emit('user.created', newUser);

      delete newUser.password;
      return {
        user: newUser,
      };
    }
    throw new BadRequestException(returnMessages.CodeNotValid);
  }

  async login(loginDto: LoginDto, withGoogleAuth = false) {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });
    if (
      (!user || !(await bcrypt.compare(loginDto.password, user.password))) &&
      !withGoogleAuth
    ) {
      throw new BadRequestException(returnMessages.EmailPasswordValidation);
    }
    if (user.emailVerifiedAt === null) {
      throw new BadRequestException(returnMessages.EmailNotVerified);
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return {
      message: returnMessages.UserSuccessfullyLoggedIn,
      data: user,
      access_token: this.jwtService.sign(payload, {
        privateKey: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }),
    };
  }

  public mailVerification(user: User) {
    const token = Math.random().toString(36).toUpperCase().slice(2, 8);

    this.mailerService
      .sendMail({
        to: user.email,
        from: process.env.APP_EMAIL,
        subject: 'User verification code',
        template: 'verification-email',
        context: {
          name: user.name,
          token,
        },
      })
      .then(() => {
        this.validationCodeRepository.save({ user: user, code: token });
        return { status: 'ok' };
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async codeVerification(codeDto: VerificationCodeDto) {
    const user = await this.userRepository.findOneBy({ email: codeDto.email });
    if (!user) {
      throw new BadRequestException(returnMessages.UserNotFound);
    }

    const userCode = await this.validationCodeRepository
      .createQueryBuilder('validation_code')
      .leftJoinAndSelect('validation_code.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .getOne();
    if (!userCode) {
      throw new BadRequestException(returnMessages.UserCodeNotFound);
    }
    if (!userCode.isValid) {
      throw new BadRequestException(returnMessages.CodeNotValid);
    }

    if (userCode.numberOfTries >= 3) {
      await this.validationCodeRepository.update(userCode.id, {
        isValid: false,
      });
      throw new BadRequestException(returnMessages.LimitReached);
    }

    if (userCode.code !== codeDto.token) {
      await this.validationCodeRepository.update(userCode.id, {
        numberOfTries: ++userCode.numberOfTries,
      });
      throw new BadRequestException(returnMessages.BadUserCode);
    }
    await this.userRepository.update(user.id, {
      emailVerifiedAt: new Date(),
    });

    await this.validationCodeRepository.update(userCode.id, {
      numberOfTries: ++userCode.numberOfTries,
      isValid: false,
    });
    return { status: 'ok' };
  }

  public async regenerateCode(codeDto: RegenerateCodeDto) {
    const user = await this.userRepository.findOneBy({ email: codeDto.email });
    if (!user) {
      throw new BadRequestException(returnMessages.UserNotFound);
    }
    await this.validationCodeRepository.update(
      { isValid: true, user: { id: user.id } },
      { isValid: false },
    );

    return this.mailVerification(user);
  }


  public async googleAuth(user: GooglePayload) {
    const userExists = await this.userRepository.findOneBy({
      email: user.email,
    });
    if (!userExists) {
      return this.register({
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        verifiedEmail: user.email,
        password: uuidv4(),
      });
    }
    return await this.login(userExists, true);
  }
}
