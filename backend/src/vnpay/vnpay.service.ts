import { Injectable } from '@nestjs/common';
import { VnpayService } from 'nestjs-vnpay';

@Injectable()
export class VNPAYService {
  constructor(private readonly vnpayService: VnpayService) {}

  async createPaymentUrl(amount: number, orderId: string, ipAddr: string) {
    return this.vnpayService.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
      vnp_TxnRef: orderId,
      vnp_IpAddr: ipAddr,
      vnp_ReturnUrl: `${process.env.FRONTEND_URL}/checkout/success`, // Thay đổi URL trả về theo frontend của bạn
    });
  }
}
