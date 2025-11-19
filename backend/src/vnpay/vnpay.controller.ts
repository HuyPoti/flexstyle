import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Body,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { VNPAYService } from './vnpay.service';
import { VnpayService } from 'nestjs-vnpay';

@Controller('vnpay')
export class VNPAYController {
  constructor(
    private readonly vnpayService: VNPAYService,
    private readonly vnpay: VnpayService,
  ) {}

  @Post('create-payment')
  async createPayment(
    @Body() body: { amount: number; orderId: string },
    @Req() req,
  ): Promise<any> {
    const ipAddr = req.ip;
    // console.log('Body:', body);
    // console.log(
    //   'Amount:',
    //   body.amount,
    //   'OrderId:',
    //   body.orderId,
    //   'IpAddr:',
    //   ipAddr,
    // );
    const url = this.vnpayService.createPaymentUrl(
      body.amount,
      body.orderId,
      ipAddr,
    );
    return url;
  }

  // @Get('return')
  // async handleReturn(@Query() query) {
  //   // Xử lý khi khách hàng được chuyển hướng về từ VNPAY
  //   const vnpResponse = this.vnpayService.verifyReturnUrl(query);
  //   return vnpResponse;
  // }
  @Get('vnpay-checksum')
  async handleChecksum(@Res() res, @Query() query) {
    const result = await this.vnpay.verifyReturnUrl(query);
    if (result.vnp_ResponseCode != '00') {
      return res.redirect(`http://localhost:3000/checkout/fail`);
    }
    return res.redirect(
      `http://localhost:3000/checkout/success?type=VNPAY&orderID=${result.vnp_TxnRef}&transactionId=${result.vnp_TransactionNo}`,
    );
  }
}
