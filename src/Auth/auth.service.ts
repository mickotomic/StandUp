import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/register.dto';

@Injectable()
export class AuthService {
 
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
      ) {}

      async register(createUserDto: UserDto) {
        const user = await this.userRepository.findOne({where: {email: createUserDto.email}});
        if (user) {
          throw new BadRequestException('Email is in use!');
        }
        const preparedUser = {
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, 10),
        };
        const newUser = await this.userRepository.save(preparedUser);
        if (newUser) {
          delete newUser.password;
          return {
            user: newUser,
          };
        } else {
          throw new BadRequestException(
            'Something went wrong! User is not created!',
          );
        }
        

    }
}


