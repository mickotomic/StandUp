import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtPayloadType } from 'src/types/payload.type';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/loginUser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto ) {
    const user = await this.userRepository.findOneBy(loginDto);
    if(!user || await bcrypt.compare(loginDto, user.password)){
      throw new BadRequestException('invalid password or email!');
    }
     if(user.emailVerifiedAt === null){
      throw new BadRequestException
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return {
      message: 'You have been successfully logged in!',
      data: user,
      access_token: this.jwtService.sign(payload, {
        privateKey: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      }),
    };
  }
}
