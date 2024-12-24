import { Test, TestingModule } from '@nestjs/testing';
import { VoucherService } from './voucher.service';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Voucher } from './models/voucher.model';
import { Customer } from '../customer/models/customer.model';
import { SpecialOffer } from '../offer/models/special-offer.model';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('VoucherService', () => {
  let service: VoucherService;
  let mockVoucherRepository: jest.Mocked<Repository<Voucher>>;
  let mockCustomerRepository: jest.Mocked<Repository<Customer>>;
  let mockSpecialOfferRepository: jest.Mocked<Repository<SpecialOffer>>;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(async () => {
    mockVoucherRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    } as any;

    mockCustomerRepository = {
      findOneByOrFail: jest.fn(),
      findOneOrFail: jest.fn(),
      findOne: jest.fn(),
    } as any;

    mockSpecialOfferRepository = {
      findOneByOrFail: jest.fn(),
    } as any;

    const mockQueryRunner = {
      manager: {
        getRepository: (entity: any) => {
          if (entity === Customer) return mockCustomerRepository;
          if (entity === SpecialOffer) return mockSpecialOfferRepository;
          if (entity === Voucher) return mockVoucherRepository;
        },
      },
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    };

    mockDataSource = {
      createQueryRunner: jest.fn(() => mockQueryRunner),
      transaction: jest.fn(async (callback) => {
        const queryRunner = mockQueryRunner;
        try {
          await queryRunner.connect();
          await queryRunner.startTransaction();
          const result = await callback(queryRunner.manager);
          await queryRunner.commitTransaction();
          return result;
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw error;
        } finally {
          await queryRunner.release();
        }
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherService,
        {
          provide: getRepositoryToken(Voucher),
          useValue: mockVoucherRepository,
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<VoucherService>(VoucherService);
  });

  describe('generateVoucher', () => {
    it('should generate a voucher successfully', async () => {
      const mockCustomer = { id: '123', email: 'test@example.com' } as Customer;
      const mockOffer = {
        id: 'offer1',
        name: 'Special Discount',
      } as SpecialOffer;
      const mockVoucher = {
        code: 'VOUCH-1234',
        id: 'voucher1',
        isUsed: false,
      } as Voucher;

      mockCustomerRepository.findOneByOrFail.mockResolvedValue(mockCustomer);
      mockSpecialOfferRepository.findOneByOrFail.mockResolvedValue(mockOffer);
      mockVoucherRepository.create.mockReturnValue(mockVoucher);
      mockVoucherRepository.save.mockResolvedValue(mockVoucher);

      const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
      const result = await service.generateVoucher(
        '123',
        'offer1',
        expirationDate,
      );

      expect(result).toEqual(mockVoucher);
      expect(mockDataSource.transaction).toHaveBeenCalled();
      expect(mockCustomerRepository.findOneByOrFail).toHaveBeenCalledWith({
        id: '123',
      });
      expect(mockSpecialOfferRepository.findOneByOrFail).toHaveBeenCalledWith({
        id: 'offer1',
      });
      expect(mockVoucherRepository.create).toHaveBeenCalledWith({
        code: expect.stringMatching(/^VOUCH-/),
        expirationDate,
        customer: mockCustomer,
        specialOffer: mockOffer,
        isUsed: false,
      });
      expect(mockVoucherRepository.save).toHaveBeenCalledWith(mockVoucher);
    });

    it('should throw BadRequestException if expiration date is in the past', async () => {
      await expect(
        service.generateVoucher('123', 'offer1', new Date(Date.now() - 1000)),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if customer is not found', async () => {
      mockCustomerRepository.findOneByOrFail.mockRejectedValue(
        new NotFoundException('EntityNotFound'),
      );

      await expect(
        service.generateVoucher('123', 'offer1', new Date(Date.now() + 1000)),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('validateVoucher', () => {
    it('should validate a voucher successfully', async () => {
      const mockCustomer = { id: '123', email: 'test@example.com' } as Customer;
      const mockVoucher = {
        code: 'VOUCH-1234',
        isUsed: false,
        expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        specialOffer: { discountPercentage: 20 } as SpecialOffer,
      } as Voucher;

      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockVoucherRepository.findOne.mockResolvedValue(mockVoucher);
      mockVoucherRepository.save.mockResolvedValue({
        ...mockVoucher,
        isUsed: true,
        usageDate: new Date(),
      });

      const result = await service.validateVoucher(
        'VOUCH-1234',
        'test@example.com',
      );

      expect(result).toEqual({
        discount: 20,
        message: 'Voucher validated successfully.',
      });
      expect(mockVoucherRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if customer is not found', async () => {
      mockCustomerRepository.findOne.mockResolvedValue(undefined);
      await expect(
        service.validateVoucher('VOUCH-1234', 'test@example.com'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if voucher is already used', async () => {
      const mockCustomer = { id: '123', email: 'test@example.com' } as Customer;
      const mockVoucher = {
        code: 'VOUCH-1234',
        isUsed: true,
      } as Voucher;

      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockVoucherRepository.findOne.mockResolvedValue(mockVoucher);

      await expect(
        service.validateVoucher('VOUCH-1234', 'test@example.com'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if voucher is expired', async () => {
      const mockCustomer = { id: '123', email: 'test@example.com' } as Customer;
      const mockVoucher = {
        code: 'VOUCH-1234',
        isUsed: false,
        expirationDate: new Date(Date.now() - 1000),
      } as Voucher;

      mockCustomerRepository.findOne.mockResolvedValue(mockCustomer);
      mockVoucherRepository.findOne.mockResolvedValue(mockVoucher);

      await expect(
        service.validateVoucher('VOUCH-1234', 'test@example.com'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getVouchersForCustomer', () => {
    it('should throw NotFoundException if customer is not found', async () => {
      mockCustomerRepository.findOneOrFail.mockRejectedValue(
        new NotFoundException('Customer not found'),
      );

      await expect(
        service.getVouchersForCustomer('nonexistent@email.com'),
      ).rejects.toThrow(NotFoundException);

      expect(mockCustomerRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { email: 'nonexistent@email.com' },
      });
    });

    it('should return an empty array if no valid vouchers are found', async () => {
      const mockCustomer = {
        id: 'customer1',
        email: 'test@email.com',
      } as Customer;
      const mockVouchers = [];

      mockCustomerRepository.findOneOrFail.mockResolvedValue(mockCustomer);
      (mockVoucherRepository.find as jest.Mock).mockResolvedValue(mockVouchers);

      const result = await service.getVouchersForCustomer('test@email.com');

      expect(result).toEqual([]);
      expect(mockCustomerRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { email: 'test@email.com' },
      });
      expect(mockVoucherRepository.find).toHaveBeenCalledWith({
        where: { customer: mockCustomer, usageDate: null },
        relations: ['specialOffer'],
      });
    });

    it('should return valid vouchers for the customer', async () => {
      const mockCustomer = {
        id: 'customer1',
        email: 'test@email.com',
      } as Customer;
      const mockVouchers = [
        {
          code: 'VOUCH-1234',
          expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
          specialOffer: { name: 'Special Offer 1', discountPercentage: 10 },
        },
        {
          code: 'VOUCH-5678',
          expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
          specialOffer: { name: 'Special Offer 2', discountPercentage: 20 },
        },
      ];

      (mockCustomerRepository.findOneOrFail as jest.Mock).mockResolvedValue(
        mockCustomer,
      );
      (mockVoucherRepository.find as jest.Mock).mockResolvedValue(mockVouchers);

      const result = await service.getVouchersForCustomer('test@email.com');

      expect(result).toEqual([
        {
          code: 'VOUCH-1234',
          discount: 10,
          offerName: 'Special Offer 1',
        },
        {
          code: 'VOUCH-5678',
          discount: 20,
          offerName: 'Special Offer 2',
        },
      ]);

      expect(mockCustomerRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { email: 'test@email.com' },
      });
      expect(mockVoucherRepository.find).toHaveBeenCalledWith({
        where: { customer: mockCustomer, usageDate: null },
        relations: ['specialOffer'],
      });
    });

    it('should filter out expired vouchers', async () => {
      const mockCustomer = {
        id: 'customer1',
        email: 'test@email.com',
      } as Customer;
      const mockVouchers = [
        {
          code: 'VOUCH-1234',
          expirationDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
          specialOffer: { name: 'Special Offer 1', discountPercentage: 10 },
        },
        {
          code: 'VOUCH-5678',
          expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
          specialOffer: { name: 'Special Offer 2', discountPercentage: 20 },
        },
      ];

      mockCustomerRepository.findOneOrFail.mockResolvedValue(mockCustomer);
      mockVoucherRepository.find.mockResolvedValue(mockVouchers as any);

      const result = await service.getVouchersForCustomer('test@email.com');

      expect(result).toEqual([
        {
          code: 'VOUCH-5678',
          discount: 20,
          offerName: 'Special Offer 2',
        },
      ]);

      expect(mockCustomerRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { email: 'test@email.com' },
      });
      expect(mockVoucherRepository.find).toHaveBeenCalledWith({
        where: { customer: mockCustomer, usageDate: null },
        relations: ['specialOffer'],
      });
    });
  });
});
