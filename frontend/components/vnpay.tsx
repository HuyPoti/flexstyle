// frontend/components/PaymentButton.tsx
import { useState } from "react";
import type { VerifyReturnUrl } from "vnpay/types-only"; // ✅ Chỉ import types
import Image from "next/image";
// import { useCart } from "@/contexts/cart-context";

interface PaymentButtonProps {
  amount: number;
  orderId: string;
  onPaymentResult?: (result: VerifyReturnUrl) => void;
}
export const VNPAY: React.FC<PaymentButtonProps> = ({
  amount,
  orderId,
}) => {
  const [loading, setLoading] = useState(false);
  // const { removeItem } = useCart();
  const handlePayment = async () => {
    setLoading(true);

    try {
      // ✅ Gọi API backend thay vì import trực tiếp
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vnpay/create-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, orderId }),
        }
      );

      const payment = await response.json();

      if (payment.statusCode == "201") {
        // removeItem(orderId);
        // Chuyển hướng đến VNPay
        window.location.href = payment.data;
      } else {
        alert("Lỗi tạo thanh toán");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="flex flex-col items-center bg-white rounded-lg shadow hover:shadow-lg transition "
      style={{ border: "1px solid #e5e7eb" }}
    >
      <Image
        src={"/vnpay.png"}
        alt="VNPay Logo"
        width={100}
        height={20}
        sizes="50vw"
        style={{
          width: "50%",
          objectFit: "contain",
        }}
      />
      {/* <span className="text-2xl font-bold text-[#e30613] leading-none">
        Ví <span className="text-[#005baa]">VN</span>PAY
      </span>
      <span className="text-base text-[#009fe3] mt-1">Ví của gia đình</span> */}
    </button>
  );
};
export default VNPAY;
