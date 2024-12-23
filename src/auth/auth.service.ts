import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  fakeUsers = [
    {
      id: 1,
      username: 'user1',
      password: 'password',
    },
  ];

  validateUser(authpayload: AuthPayloadDTO) {
    const { username, password } = authpayload;

    const foundUser = this.fakeUsers.find((user) => user.username === username);

    if (!foundUser) throw new UnauthorizedException();
    if (password === foundUser.password) {
      const { password, ...myUser } = foundUser;
      return this.jwtService.sign(myUser);
    }
  }
}
