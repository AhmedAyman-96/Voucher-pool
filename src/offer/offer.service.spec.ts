import { Test, TestingModule } from '@nestjs/testing';
import { OfferService } from './offer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SpecialOffer } from './models/special-offer.model';
import { Repository } from 'typeorm';

describe('OfferService', () => {
  let service: OfferService;
  let offerRepository: Repository<SpecialOffer>;

  const mockOfferRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfferService,
        {
          provide: getRepositoryToken(SpecialOffer),
          useValue: mockOfferRepository,
        },
      ],
    }).compile();

    service = module.get<OfferService>(OfferService);
    offerRepository = module.get<Repository<SpecialOffer>>(
      getRepositoryToken(SpecialOffer),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllOffers', () => {
    it('should return an array of offers', async () => {
      const mockOffers = [
        { id: '1', name: 'ten', discountPercentage: 10 },
        { id: '2', name: 'fifty', discountPercentage: 50 },
      ];

      mockOfferRepository.find.mockResolvedValue(mockOffers);

      const result = await service.getAllOffers();

      expect(result).toEqual(mockOffers);
      expect(mockOfferRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if fetching offers fails', async () => {
      mockOfferRepository.find.mockRejectedValue(
        new Error('Failed to fetch offers'),
      );

      try {
        await service.getAllOffers();
      } catch (error) {
        expect(error.message).toBe('Failed to fetch offers');
      }
    });
  });
});
