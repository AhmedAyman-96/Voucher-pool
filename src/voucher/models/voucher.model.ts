import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SpecialOffer } from '../../offer/models/special-offer.model';
import { Customer } from '../../customer/models/customer.model';

@Entity()
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  expirationDate: Date;

  @Column({ nullable: true })
  usageDate: Date;

  @Column({ nullable: false })
  isUsed: boolean;

  @ManyToOne(() => Customer, (customer) => customer.vouchers)
  customer: Customer;

  @ManyToOne(() => SpecialOffer, (specialOffer) => specialOffer.vouchers)
  specialOffer: SpecialOffer;
}
