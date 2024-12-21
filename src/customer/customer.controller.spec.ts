import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  const mockCustomerService = {
    getAllCustomers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCustomers', () => {
    it('should return an array of customers', async () => {
      const mockCustomers = [
        { id: '1', name: 'Customer1', email: 'customer1@example.com' },
        { id: '2', name: 'Customer2', email: 'customer2@example.com' },
      ];

      mockCustomerService.getAllCustomers.mockResolvedValue(mockCustomers);

      const result = await controller.getAllCustomers();

      expect(result).toEqual(mockCustomers);
      expect(mockCustomerService.getAllCustomers).toHaveBeenCalled();
    });

    it('should throw an error if fetching customers fails', async () => {
      mockCustomerService.getAllCustomers.mockRejectedValue(
        new Error('Failed to fetch customers'),
      );

      try {
        await controller.getAllCustomers();
      } catch (error) {
        expect(error.message).toBe('Failed to fetch customers');
      }
    });
  });
});
