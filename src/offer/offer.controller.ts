import { Controller, Get } from '@nestjs/common';
import { OfferService } from './offer.service';

@Controller('offers')
export class OfferController {
  constructor(private offerService: OfferService) {}

  @Get()
  async getAllOffers() {
    return this.offerService.getAllOffers();
  }
}
