import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { UserDto } from "./dto/register.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { MailerService } from "@nestjs-modules/mailer";
import * as process from "process";
import { ValidationCode } from "../entities/validation_code.entity";

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    private mailerService: MailerService
@InjectRepository(ValidationCode)
  private validationCodeRepository: Repository<ValidationCode>

) {}

  async register(createUserDto: UserDto) {
    const user = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (user) {
      throw new BadRequestException("Email is in use!");
    }
    const preparedUser = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10)
    };
    const newUser = await this.userRepository.save(preparedUser);
    if (newUser) {
      delete newUser.password;
      this.eventEmitter.emit(
        "user.created",
        newUser
      );

      return {
        user: newUser
      };
    } else {
      throw new BadRequestException(
        "Something went wrong! User is not created!"
      );
    }
  }


  async mailVerification(user: User) {
    const userLink = process.env.BASE_URL + process.env.APP_PORT +
      `/auth/verification?userId=${user.id}`;

    const token = Math.random().toString(36).toUpperCase().slice(2, 8);

    const verificationToken = await this.validationCodeRepository.findOneBy({user: user, isValid: true});

    if (verificationToken){
      verificationToken.isValid = false;
      this.validationCodeRepository.save(verificationToken);
    }

    this.mailerService.sendMail({
      to: user.email,
      from: process.env.APP_EMAIL,
      subject: "User verification code."
      template: "verification-email",
      contex: {
        userLink,
        name: user.name,
        token
      }
    }).then((info)=>{
      this.validationCodeRepository.save({user: User, code: token});
    });

  }
}


