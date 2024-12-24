import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString } from 'class-validator';
import { Customer } from '../../customer/models/customer.model';
import { SpecialOffer } from '../../offer/models/special-offer.model';

export class CreateVoucherDto {
  @ApiProperty({
    description: 'ID of the customer',
    example: '202744c2-5faf-4b25-8752-409f299145b1',
  })
  @IsUUID()
  customerId: string;

  @ApiProperty({
    description: 'ID of the special offer',
    example: '3de7c20a-3019-4153-90be-3f4b1c0b2159',
  })
  @IsUUID()
  offerId: string;

  @ApiProperty({
    description: 'Expiration date of the voucher',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsDateString()
  expirationDate: string;
}

export class CreateVoucherReturnDto {
  @ApiProperty({ type: String })
  code: string;
  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    type: Date,
  })
  expirationDate: Date;
  @ApiProperty({ type: Boolean })
  isUsed: boolean;
  @ApiProperty({ type: Customer })
  customer: Customer;
  @ApiProperty({ type: SpecialOffer })
  specialOffer: SpecialOffer;
  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    type: Date,
  })
  usageDate: Date;
}
