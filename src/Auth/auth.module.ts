import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ValidationCode } from "../entities/validation-code.entity";
import { MailVerificationListener } from "../events/mail-verification.listener";

@Module({
  imports: [TypeOrmModule.forFeature([User, ValidationCode])],
  controllers: [AuthController],
  providers: [AuthService, JwtService, MailVerificationListener],
})
export class AuthModule {}
