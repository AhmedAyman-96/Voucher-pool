import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayloadDTO } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body(ValidationPipe) authPayLoad: AuthPayloadDTO) {
    return this.authService.validateUser(authPayLoad);
  }

  @Get('status')
  status(@Req() req: Request) {
    return req.user;
  }
}
