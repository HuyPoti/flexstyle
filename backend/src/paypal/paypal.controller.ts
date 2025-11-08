import { Controller, Post, Body } from '@nestjs/common';
import { PaypalService } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('create-paypal-order')
  async createOrder(
    @Body()
    body: {
      value: string;
      currency_code: string;
      reference_id: string;
    },
  ): Promise<any> {
    return await this.paypalService.createOrder(
      body.value,
      body.currency_code,
      body.reference_id,
    );
  }

  @Post('capture-paypal-order')
  async captureOrder(@Body() body: { orderID: string }): Promise<any> {
    return await this.paypalService.captureOrder(body.orderID);
  }
}
