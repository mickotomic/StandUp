import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/register.dto';
import { VerificationCodeDto } from './dto/code-verification.dto';
import { RegenerateCodeDto } from './dto/regenerate-code.dto';
import { LoginDto } from './dto/loginUser.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: UserDto) {
    return await this.authService.register(body);
  }

  @Post('/login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post('/verification')
  async codeVerification(@Body() code: VerificationCodeDto) {
    return this.authService.codeVerification(code);
  }

  @Post('/regenerate-code')
  async regenerateCode(@Body() email: RegenerateCodeDto) {
    return await this.authService.regenerateCode(email);
  }
}
