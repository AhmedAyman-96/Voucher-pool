import { Module } from '@nestjs/common';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialOffer } from './models/special-offer.model';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialOffer])],

  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
