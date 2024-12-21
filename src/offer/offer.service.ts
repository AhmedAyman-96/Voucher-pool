import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { SpecialOffer } from './models/special-offer.model';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(SpecialOffer)
    private readonly offerRepoistory: Repository<SpecialOffer>,
  ) {}
  async getAllOffers() {
    return this.offerRepoistory.find();
  }
}
