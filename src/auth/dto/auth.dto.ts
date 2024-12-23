import { IsString } from 'class-validator';

export class AuthPayloadDTO {
  @IsString()
  username: string;
  @IsString()
  password: string;
}
