import { Voucher } from '../../voucher/models/voucher.model';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class SpecialOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  discountPercentage: number;

  @OneToMany(() => Voucher, (voucher) => voucher.specialOffer)
  vouchers: Voucher[];
}
