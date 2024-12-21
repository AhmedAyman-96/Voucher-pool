import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { ValidateVoucherDto } from './dto/validate-voucher.dto';

@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('generate')
  async generateVoucher(@Body() createVoucherDto: CreateVoucherDto) {
    const { customerId, offerId, expirationDate } = createVoucherDto;
    return this.voucherService.generateVoucher(
      customerId,
      offerId,
      new Date(expirationDate),
    );
  }

  @Post('validate')
  async validateVoucher(@Body() validateVoucherDto: ValidateVoucherDto) {
    const { email, voucherCode } = validateVoucherDto;
    return this.voucherService.validateVoucher(voucherCode, email);
  }

  @Get('customer/:email')
  async getVouchersForCustomer(@Param('email') email: string) {
    return this.voucherService.getVouchersForCustomer(email);
  }
}
