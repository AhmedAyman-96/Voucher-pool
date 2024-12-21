import { IsString, IsEmail } from 'class-validator';

export class ValidateVoucherDto {
  @IsEmail()
  email: string;

  @IsString()
  voucherCode: string;
}
