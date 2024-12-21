import { Test, TestingModule } from '@nestjs/testing';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { ValidateVoucherDto } from './dto/validate-voucher.dto';

describe('VoucherController', () => {
  let controller: VoucherController;
  let service: VoucherService;

  const mockVoucherService = {
    generateVoucher: jest.fn(),
    validateVoucher: jest.fn(),
    getVouchersForCustomer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherController],
      providers: [
        {
          provide: VoucherService,
          useValue: mockVoucherService,
        },
      ],
    }).compile();

    controller = module.get<VoucherController>(VoucherController);
    service = module.get<VoucherService>(VoucherService);
  });

  describe('generateVoucher', () => {
    it('should call the service with correct parameters and return the generated voucher', async () => {
      const createVoucherDto: CreateVoucherDto = {
        customerId: 'customer1',
        offerId: 'offer1',
        expirationDate: '2024-12-31',
      };

      const mockVoucher = {
        id: 'voucher1',
        code: 'VOUCH-1234',
      };

      mockVoucherService.generateVoucher.mockResolvedValue(mockVoucher);

      const result = await controller.generateVoucher(createVoucherDto);

      expect(mockVoucherService.generateVoucher).toHaveBeenCalledWith(
        'customer1',
        'offer1',
        new Date('2024-12-31'),
      );
      expect(result).toEqual(mockVoucher);
    });
  });

  describe('validateVoucher', () => {
    it('should call the service with correct parameters and return validation result', async () => {
      const validateVoucherDto: ValidateVoucherDto = {
        email: 'test@example.com',
        voucherCode: 'VOUCH-1234',
      };

      const mockValidationResult = {
        discount: 20,
        message: 'Voucher validated successfully.',
      };

      mockVoucherService.validateVoucher.mockResolvedValue(
        mockValidationResult,
      );

      const result = await controller.validateVoucher(validateVoucherDto);

      expect(mockVoucherService.validateVoucher).toHaveBeenCalledWith(
        'VOUCH-1234',
        'test@example.com',
      );
      expect(result).toEqual(mockValidationResult);
    });
  });

  describe('getVouchersForCustomer', () => {
    it('should call the service with correct email and return vouchers', async () => {
      const email = 'test@example.com';

      const mockVouchers = [
        {
          code: 'VOUCH-1234',
          discount: 20,
          offerName: 'Special Discount',
        },
        {
          code: 'VOUCH-5678',
          discount: 10,
          offerName: 'Holiday Sale',
        },
      ];

      mockVoucherService.getVouchersForCustomer.mockResolvedValue(mockVouchers);

      const result = await controller.getVouchersForCustomer(email);

      expect(mockVoucherService.getVouchersForCustomer).toHaveBeenCalledWith(
        email,
      );
      expect(result).toEqual(mockVouchers);
    });
  });
});
