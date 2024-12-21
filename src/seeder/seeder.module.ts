import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/models/customer.model';
import { SpecialOffer } from '../offer/models/special-offer.model';

@Module({
  providers: [SeederService],
  imports: [TypeOrmModule.forFeature([Customer, SpecialOffer])],
})
export class SeederModule {}
