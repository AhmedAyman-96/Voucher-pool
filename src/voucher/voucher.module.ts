import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { Voucher } from './models/voucher.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/models/customer.model';
import { SpecialOffer } from '../offer/models/special-offer.model';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher, SpecialOffer, Customer])],
  providers: [VoucherService],
  controllers: [VoucherController],
})
export class VoucherModule {}
