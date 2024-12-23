import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class ValidateVoucherDto {
  @ApiProperty({
    description: 'Email of the customer',
    example: 'customer@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Voucher code', example: 'VOUCH-1234' })
  @IsString()
  voucherCode: string;
}

export class ValidateVoucherReturnDto {
  @ApiProperty({
    type: Number,
  })
  discountPercentage: number;

  @ApiProperty()
  message: string;
}
