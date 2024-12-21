import { Test, TestingModule } from '@nestjs/testing';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

describe('OfferController', () => {
  let controller: OfferController;
  let service: OfferService;

  const mockOfferService = {
    getAllOffers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferController],
      providers: [
        {
          provide: OfferService,
          useValue: mockOfferService,
        },
      ],
    }).compile();

    controller = module.get<OfferController>(OfferController);
    service = module.get<OfferService>(OfferService);
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

      mockOfferService.getAllOffers.mockResolvedValue(mockOffers);

      const result = await controller.getAllOffers();

      expect(result).toEqual(mockOffers);
      expect(mockOfferService.getAllOffers).toHaveBeenCalled();
    });

    it('should throw an error if something goes wrong', async () => {
      mockOfferService.getAllOffers.mockRejectedValue(
        new Error('Failed to fetch offers'),
      );

      try {
        await controller.getAllOffers();
      } catch (error) {
        expect(error.message).toBe('Failed to fetch offers');
      }
    });
  });
});
