"use client";

import { Button } from "@/components/ui/button";
import { useOrder } from "@/contexts/order-context";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function CheckoutFailPage() {
  const { clearOrder } = useOrder();
  useEffect(() => {
    clearOrder();
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Đặt hàng thất bại!</h1>
          <p className="text-muted-foreground">
            Rất tiếc, đã có lỗi xảy ra trong quá trình đặt hàng của bạn. Liên hệ
            với nhân viên chăm sóc khách hàng để được hỗ trợ.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/cart">Quay lại giỏ hàng</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/products">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
