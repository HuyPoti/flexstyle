"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/help";

export default function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } =
    useCart();
  const [selectedProductId, setSelectedProductId] = useState<string>(
    items[0]?.productId || ""
  );

  // const [shippingCost, setShippingCost] = useState<number>(0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (confirm("Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?")) {
      clearCart();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {items.length > 0 ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Giỏ hàng</h1>
              <p className="text-muted-foreground">
                Bạn có {itemCount} sản phẩm trong giỏ hàng
              </p>
            </div>
            <Button variant="outline" onClick={handleClearCart}>
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa tất cả
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.productId}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Chọn mặt hàng để thanh toán */}
                      <input
                        type="radio"
                        name="selectedProduct"
                        checked={selectedProductId === item.productId}
                        onChange={() => setSelectedProductId(item.productId)}
                        className="mt-2 mr-2 border-2 h-5 w-5"
                        aria-label="Chọn mặt hàng để thanh toán"
                      />
                      {/* Product Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <span>Size: {item.size}</span>
                          <span>Màu: {item.color}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">
                            {formatPrice(item.price)}
                          </span>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Tạm tính ({itemCount} sản phẩm)</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    {/* <div className="flex justify-between text-sm">
                      <span>Phí vận chuyển</span>
                      <span className="text-primary">{setShippingCost(formatPrice(total * 0.05))}</span>
                    </div> */}
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                    <Separator className="border-b border-purple-200" />
                  </div>

                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full"
                      asChild
                      disabled={!selectedProductId}
                    >
                      <Link
                        href={
                          selectedProductId
                            ? `/checkout?productId=${selectedProductId}`
                            : "#"
                        }
                      >
                        Thanh toán mặt hàng đã chọn
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full bg-transparent"
                      asChild
                    >
                      <Link href="/products">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Tiếp tục mua sắm
                      </Link>
                    </Button>
                  </div>

                  {/* Shipping Info */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold text-sm mb-2">
                      Thông tin giao hàng
                    </h3>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {/* <li>• Miễn phí giao hàng toàn quốc</li> */}
                      <li>• Giao hàng trong 2-3 ngày làm việc</li>
                      <li>• Hỗ trợ đổi trả trong 30 ngày</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Giỏ hàng trống</h1>
            <p className="text-muted-foreground mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Button asChild>
              <Link href="/products">Tiếp tục mua sắm</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
