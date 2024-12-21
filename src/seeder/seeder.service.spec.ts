import { Test, TestingModule } from '@nestjs/testing';
import { SeederService } from './seeder.service';
import { Customer } from '../customer/models/customer.model';
import { SpecialOffer } from '../offer/models/special-offer.model';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('SeederService', () => {
  let service: SeederService;
  let customerRepository: Repository<Customer>;
  let offersRepository: Repository<SpecialOffer>;

  const mockCustomerRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockOffersRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
        {
          provide: getRepositoryToken(SpecialOffer),
          useValue: mockOffersRepository,
        },
      ],
    }).compile();

    service = module.get<SeederService>(SeederService);
    customerRepository = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
    offersRepository = module.get<Repository<SpecialOffer>>(
      getRepositoryToken(SpecialOffer),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should call seedCustomers and seedOffers', async () => {
      const seedCustomersSpy = jest
        .spyOn(service, <any>'seedCustomers')
        .mockResolvedValue(undefined);
      const seedOffersSpy = jest
        .spyOn(service, <any>'seedOffers')
        .mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(seedCustomersSpy).toHaveBeenCalled();
      expect(seedOffersSpy).toHaveBeenCalled();
    });
  });

  describe('seedCustomers', () => {
    it('should not seed customers if customers exist', async () => {
      mockCustomerRepository.find.mockResolvedValue([
        { id: 1, name: 'Existing Customer', email: 'existing@example.com' },
      ]);

      await service['seedCustomers']();

      expect(mockCustomerRepository.find).toHaveBeenCalled();
      expect(mockCustomerRepository.save).not.toHaveBeenCalled();
    });

    it('should seed customers if no customers exist', async () => {
      mockCustomerRepository.find.mockResolvedValue([]);
      mockCustomerRepository.create.mockReturnValue([
        { name: 'Customer1', email: 'customer1@example.com' },
      ]);
      mockCustomerRepository.save.mockResolvedValue([
        { name: 'Customer1', email: 'customer1@example.com' },
      ]);

      await service['seedCustomers']();

      expect(mockCustomerRepository.find).toHaveBeenCalled();
      expect(mockCustomerRepository.create).toHaveBeenCalled();
      expect(mockCustomerRepository.save).toHaveBeenCalled();
    });
  });

  describe('seedOffers', () => {
    it('should not seed offers if offers exist', async () => {
      mockOffersRepository.find.mockResolvedValue([
        { id: 1, name: 'Existing Offer', discountPercentage: 10 },
      ]);

      await service['seedOffers']();

      expect(mockOffersRepository.find).toHaveBeenCalled();
      expect(mockOffersRepository.save).not.toHaveBeenCalled();
    });

    it('should seed offers if no offers exist', async () => {
      mockOffersRepository.find.mockResolvedValue([]);
      mockOffersRepository.create.mockReturnValue([
        { name: 'ten', discountPercentage: 10 },
      ]);
      mockOffersRepository.save.mockResolvedValue([
        { name: 'ten', discountPercentage: 10 },
      ]);

      await service['seedOffers']();

      expect(mockOffersRepository.find).toHaveBeenCalled();
      expect(mockOffersRepository.create).toHaveBeenCalled();
      expect(mockOffersRepository.save).toHaveBeenCalled();
    });
  });
});
