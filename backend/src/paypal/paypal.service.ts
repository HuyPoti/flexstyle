// filepath: d:\Project\flex-style\backend\src\paypal\paypal.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaypalService {
  private clientId = .PAYPAL_CLIENT_ID;
  private clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  private apiUrl = 'https://api-m.sandbox.paypal.com';
  calculateCartTotal(cart: { id: string; quantity: number }[]): number {
    return cart.reduce((total, item) => total + item.quantity * 20, 0);
  }
  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
      'base64',
    );
    try {
      const response = await fetch(`${this.apiUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${auth}`,
        },
        body: 'grant_type=client_credentials',
      });
      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Failed to get PayPal access token: ${response.status} ${errorText}`,
        );
      }
      const data: any = await response.json();
      return data.access_token;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error getting PayPal access token: ${error.message}`);
      } else {
        throw new Error('Error getting PayPal access token: Unknown error');
      }
    }
  }
  async createOrder(
    value: string,
    currency_code: string,
    reference_id: string,
  ): Promise<any> {
    // create accessToken using your clientID and clientSecret
    // for the full stack example, please see the Standard Integration guide
    // https://developer.paypal.com/docs/multiparty/checkout/standard/integrate/
    const accessToken = await this.getAccessToken();
    try {
      const response = await fetch(
        'https://api-m.sandbox.paypal.com/v2/checkout/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            purchase_units: [
              {
                amount: {
                  currency_code: currency_code,
                  value: Number(value).toFixed(2),
                },
                reference_id: reference_id,
              },
            ],
            intent: 'CAPTURE',
            payment_source: {
              paypal: {
                experience_context: {
                  payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
                  payment_method_selected: 'PAYPAL',
                  brand_name: 'FlexStyle Store',
                  locale: 'vi-VN',
                  landing_page: 'LOGIN',
                  shipping_preference: 'GET_FROM_FILE',
                  user_action: 'PAY_NOW',
                  return_url: 'https://example.com/returnUrl',
                  cancel_url: 'https://example.com/cancelUrl',
                },
              },
            },
          }),
        },
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `PayPal order creation failed: ${response.status} ${errorText}`,
        );
      }
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error creating PayPal order: ${error.message}`);
      } else {
        throw new Error('Error creating PayPal order: Unknown error');
      }
    }
  }

  async captureOrder(orderID: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    try {
      const response = await fetch(
        `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `PayPal order capture failed: ${response.status} ${errorText}`,
        );
      }
      const data = await response.json();
      console.log('Capture Order Response:', data);
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error capturing PayPal order: ${error.message}`);
      } else {
        throw new Error('Error capturing PayPal order: Unknown error');
      }
    }
  }
}
