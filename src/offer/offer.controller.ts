import { Controller, Get } from '@nestjs/common';
import { OfferService } from './offer.service';
import { SpecialOffer } from './models/special-offer.model';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('offers')
export class OfferController {
  constructor(private offerService: OfferService) {}

  @Get()
  @ApiOperation({ summary: 'Get all offers' })
  @ApiResponse({
    status: 200,
    description: 'List of Special Offers',
    type: SpecialOffer,
  })
  async getAllOffers() {
    return this.offerService.getAllOffers();
  }
}
