import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserDto } from './dto/register.dto';
import { CodeVerificationDto } from './dto/code-verification.dto';
import { User } from "../entities/user.entity";

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: UserDto) {
    return await this.authService.register(body);
  }

  @Post('/verification')
  async codeVerification(@Body() code: CodeVerificationDto) {
    return this.authService.codeVerification(code);
  }

  @Post('/regenarate-code')
  async regenerateCode(@Body() user: User){
    return await this.authService.mailVerification(user);
  }

}
