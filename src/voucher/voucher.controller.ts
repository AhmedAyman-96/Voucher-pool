import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { VoucherService } from './voucher.service';
import {
  CreateVoucherDto,
  CreateVoucherReturnDto,
} from './dto/create-voucher.dto';
import {
  ValidateVoucherDto,
  ValidateVoucherReturnDto,
} from './dto/validate-voucher.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Voucher } from './models/voucher.model';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new voucher' })
  @ApiResponse({
    status: 201,
    description: 'Voucher successfully generated',
    type: CreateVoucherReturnDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Expiration date cannot be in the past',
  })
  @ApiResponse({
    status: 500,
    description: 'An error occurred while generating the voucher.',
  })
  async generateVoucher(
    @Body(ValidationPipe) createVoucherDto: CreateVoucherDto,
  ) {
    const { customerId, offerId, expirationDate } = createVoucherDto;
    return this.voucherService.generateVoucher(
      customerId,
      offerId,
      new Date(expirationDate),
    );
  }

  @ApiOperation({ summary: 'Validate a voucher' })
  @ApiResponse({
    status: 200,
    description: 'Voucher successfully validated',
    type: ValidateVoucherReturnDto,
  })
  @ApiResponse({ status: 400, description: 'Voucher has already been used' })
  @ApiResponse({ status: 400, description: 'Voucher has expired' })
  @ApiResponse({
    status: 404,
    description: 'Voucher not found or does not belong to this customer',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Post('validate')
  async validateVoucher(
    @Body(ValidationPipe) validateVoucherDto: ValidateVoucherDto,
  ) {
    const { email, voucherCode } = validateVoucherDto;
    return this.voucherService.validateVoucher(voucherCode, email);
  }

  @SkipThrottle({ default: false })
  @Get('customer/:email')
  @ApiOperation({ summary: 'Get all vouchers for a customer' })
  @ApiResponse({
    status: 200,
    description: 'List of valid vouchers',
    type: Voucher,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getVouchersForCustomer(@Param('email') email: string) {
    return this.voucherService.getVouchersForCustomer(email);
  }
}
