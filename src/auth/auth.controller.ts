import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserDto } from './dto/register.dto';
import { LoginDto } from './dto/loginUser.dto';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() body: UserDto ) {
    return await this.authService.register(body);
  } 
  @Post('/login')
  async login(@Body() body: LoginDto){
    return await this.authService.login(body)
  }
  
}