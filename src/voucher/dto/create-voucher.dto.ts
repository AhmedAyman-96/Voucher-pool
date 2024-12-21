import { IsUUID, IsDateString } from 'class-validator';

export class CreateVoucherDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  offerId: string;

  @IsDateString()
  expirationDate: string;
}
