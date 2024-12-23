import { Controller, Get } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Customer } from './models/customer.model';

@Controller('customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: 200,
    description: 'List of valid customers',
    type: Customer,
  })
  async getAllCustomers() {
    return this.customerService.getAllCustomers();
  }
}
