import { ApiProperty } from '@nestjs/swagger';
import { Voucher } from '../../voucher/models/voucher.model';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class SpecialOffer {
  @ApiProperty({
    example: 'de7c20a-3019-4153-90be-3f4b1c0b2159',
    type: String,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'offer1',
    type: String,
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 20,
    type: Number,
  })
  @Column('decimal')
  discountPercentage: number;

  @OneToMany(() => Voucher, (voucher) => voucher.specialOffer)
  vouchers: Voucher[];
}
