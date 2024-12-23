import { ApiProperty } from '@nestjs/swagger';
import { Voucher } from '../../voucher/models/voucher.model';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Customer {
  @ApiProperty({
    example: 'de7c20a-3019-4153-90be-3f4b1c0b2159',
    type: String,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'customer@example.com',
    type: String,
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'customer1',
    type: String,
  })
  @Column()
  name: string;

  @OneToMany(() => Voucher, (voucher) => voucher.customer)
  vouchers: Voucher[];
}
