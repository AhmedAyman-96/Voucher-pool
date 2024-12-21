import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Voucher } from './models/voucher.model';
import { Customer } from '../customer/models/customer.model';
import { SpecialOffer } from '../offer/models/special-offer.model';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private readonly voucherRepository: Repository<Voucher>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Generate a voucher for a customer and special offer
   */
  async generateVoucher(
    customerId: string,
    offerId: string,
    expirationDate: Date,
  ) {
    if (expirationDate < new Date()) {
      throw new BadRequestException('Expiration date cannot be in the past.');
    }

    try {
      return await this.dataSource.transaction(async (manager) => {
        const customer = await manager.getRepository(Customer).findOneByOrFail({
          id: customerId,
        });

        const specialOffer = await manager
          .getRepository(SpecialOffer)
          .findOneByOrFail({
            id: offerId,
          });

        const voucherCode = `VOUCH-${Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase()}`;

        const voucher = manager.getRepository(Voucher).create({
          code: voucherCode,
          expirationDate,
          customer,
          specialOffer,
          isUsed: false,
        });

        return await manager.getRepository(Voucher).save(voucher);
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Customer or special offer not found.');
      }
      throw new InternalServerErrorException(
        'An error occurred while generating the voucher.',
      );
    }
  }

  /**
   * Validate a voucher code and mark it as used
   */
  async validateVoucher(voucherCode: string, email: string) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const customer = await manager.getRepository(Customer).findOne({
          where: { email },
        });
        if (!customer) {
          throw new NotFoundException('Customer with this email not found.');
        }

        const voucher = await manager.getRepository(Voucher).findOne({
          where: { code: voucherCode, customer },
          relations: ['specialOffer'],
        });
        if (!voucher) {
          throw new NotFoundException(
            'Voucher not found or does not belong to this customer.',
          );
        }

        if (voucher.isUsed) {
          throw new BadRequestException('Voucher has already been used.');
        }

        if (voucher.expirationDate < new Date()) {
          throw new BadRequestException('Voucher has expired.');
        }

        voucher.usageDate = new Date();
        voucher.isUsed = true;
        await manager.getRepository(Voucher).save(voucher);

        return {
          discount: voucher.specialOffer.discountPercentage,
          message: 'Voucher validated successfully.',
        };
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while validating the voucher.',
      );
    }
  }

  /**
   * Get all valid (unused and not expired) vouchers for a customer
   */
  async getVouchersForCustomer(email: string) {
    try {
      const customer = await this.customerRepository.findOneOrFail({
        where: { email },
      });

      const vouchers = await this.voucherRepository.find({
        where: { customer, usageDate: null },
        relations: ['specialOffer'],
      });

      const validVouchers = vouchers.filter(
        (voucher) => voucher.expirationDate > new Date(),
      );

      return validVouchers.map((voucher) => ({
        code: voucher.code,
        discount: voucher.specialOffer.discountPercentage,
        offerName: voucher.specialOffer.name,
      }));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Customer with this email not found.');
      }
      throw new InternalServerErrorException(
        'An error occurred while retrieving vouchers.',
      );
    }
  }
}
