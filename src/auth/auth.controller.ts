import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { GooglePayload } from 'src/types/google-auth-payload.type';
import { AuthService } from './auth.service';
import { VerificationCodeDto } from './dto/code-verification.dto';
import { LoginDto } from './dto/loginUser.dto';
import { RegenerateCodeDto } from './dto/regenerate-code.dto';
import { UserDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    description: `This endpoint should be used for the registration
      generally it is used with name, email and password, but if users registers
      through the invitation flow, then verifiedEmail is also needed`,
  })
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
    return await this.authService.codeVerification(code);
  }

  @ApiOperation({
    description: 'Intended to be used foe generating new verification code',
  })
  @Post('/regenerate-code')
  async regenerateCode(@Body() email: RegenerateCodeDto) {
    return await this.authService.regenerateCode(email);
  }

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google-oauth'))
  async googleAuth(@GetUser() user: GooglePayload) {
    return await this.authService.googleAuth(user);
  }

  @ApiBearerAuth()
  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@GetUser() user: User) {
    return this.authService.getMe(user);
  }
}
