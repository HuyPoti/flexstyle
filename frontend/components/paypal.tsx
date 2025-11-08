"use client";
import {
  PayPalButtons,
  PayPalScriptProvider,
  PayPalButtonsComponentProps,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { useCart } from "@/contexts/cart-context";


interface PayPalProps {
  value: string;
  reference_id: string;
  productDetailId: string;
}

export default function PayPal({ value, reference_id, productDetailId }: PayPalProps) {
  const { removeItem } = useCart();
  const initialOptions: ReactPayPalScriptOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    components: "buttons",
  };

  const createOrder: PayPalButtonsComponentProps["createOrder"] = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/paypal/create-paypal-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            value: String(value),
            currency_code: "USD",
            reference_id,
          }),
        }
      );

      const orderData = await response.json();

      if (!orderData?.data?.id)
        throw new Error("Failed to create PayPal order");
      return orderData.data.id;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  };

  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data) => {
    console.log("PayPal onApprove data:", data);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/paypal/capture-paypal-order`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID }),
      }
    );

    const details = await response.json();
    console.log("PayPal capture details:", details.data);
    if (details){
      if (!details.data){
        alert("Thanh toán thất bại!");
        window.location.href = `/checkout/fail`;
        return;
      }
      else{
        // alert("Thanh toán thành công! " + details?.data.payer?.name?.given_name);
        removeItem(productDetailId);
        window.location.href = `/checkout/success?type=PAYPAL&orderID=${reference_id}&transactionId=${details.data.id}`;
      }
    }
    else{
      alert("Lỗi thanh toán!");
      window.location.href = `/checkout/fail`;
    }
  };
  const styles: PayPalButtonsComponentProps["style"] = {
    shape: "rect",
    layout: "vertical",
  };
  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        style={styles}
        fundingSource="paypal"
      />
    </PayPalScriptProvider>
  );
}
