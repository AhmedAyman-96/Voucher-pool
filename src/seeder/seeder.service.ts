import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customer/models/customer.model';
import { SpecialOffer } from '../offer/models/special-offer.model';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(SpecialOffer)
    private readonly offersRepository: Repository<SpecialOffer>,
  ) {}

  async onModuleInit() {
    await this.seedCustomers();
    await this.seedOffers();
  }

  private async seedCustomers() {
    const existingCustomers = await this.customerRepository.find();

    if (existingCustomers.length > 0) {
      return;
    }

    const seededCustomers = [
      { name: 'Customer1', email: 'customer1@example.com' },
      { name: 'Customer2', email: 'customer2@example.com' },
      { name: 'Customer3', email: 'customer3@example.com' },
    ];

    const customers = this.customerRepository.create(seededCustomers);
    await this.customerRepository.save(customers);
  }
  private async seedOffers() {
    const existingOffers = await this.offersRepository.find();

    if (existingOffers.length > 0) {
      return;
    }

    const seededOffers = [
      { name: 'ten', discountPercentage: 10 },
      { name: 'fifty', discountPercentage: 50 },
      { name: 'ninty', discountPercentage: 90 },
    ];

    const offers = this.offersRepository.create(seededOffers);
    await this.offersRepository.save(offers);
  }
}
