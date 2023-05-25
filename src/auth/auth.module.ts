import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
   UserModule,
    JwtModule.register({
      global:true,
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '10h'}
    })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
