import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from './models/customer.model';
import { Repository } from 'typeorm';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepository: Repository<Customer>;

  const mockCustomerRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
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

      mockCustomerRepository.find.mockResolvedValue(mockCustomers);

      const result = await service.getAllCustomers();

      expect(result).toEqual(mockCustomers);
      expect(mockCustomerRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if fetching customers fails', async () => {
      mockCustomerRepository.find.mockRejectedValue(
        new Error('Failed to fetch customers'),
      );

      try {
        await service.getAllCustomers();
      } catch (error) {
        expect(error.message).toBe('Failed to fetch customers');
      }
    });
  });
});
