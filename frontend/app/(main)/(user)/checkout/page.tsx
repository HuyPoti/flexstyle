"use client";

import type React from "react";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import PayPal from "@/components/paypal";
import { VNPAY } from "@/components/vnpay";
import { X, Tickets } from "lucide-react";
import { CartItem } from "@/lib/types";
import { useSuKienUuDai } from "@/contexts/sukienuudai-context";
import { useOrder } from "@/contexts/order-context";
import Image from "next/image";
export default function CheckoutPage() {
  const { items } = useCart();
  const searchParams = useSearchParams();
  const selectedProductId = searchParams.get("productId");
  const [selectedItem, setSelectedItem] = useState<CartItem | undefined>();
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [orderId, setOrderId] = useState(uuidv4());
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [finalTotal, setFinalTotal] = useState<number>(0);
  const [voucherCodeCustomer, setvoucherCodeCustomer] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherMessage, setVoucherMessage] = useState("");
  const [checkVoucher, setCheckVoucher] = useState(false);
  const { user } = useAuth();
  const { suKienUuDais } = useSuKienUuDai();
  const [userInfo] = useState(user);
  const { order, setOrder } = useOrder();
  const [discountAmount, setDiscountAmount] = useState(0);
  const [formData, setFormData] = useState(() => {
    return {
      email: user?.email || "",
      firstName: user?.user_metadata?.name?.split(" ")[0] || "",
      lastName: user?.user_metadata?.name?.split(" ")[1] || "",
      phone: "",
      address: "",
      // city: "",
      // postalCode: "",
      country: "Vietnam",
      paymentMethod: "card",
      shippingMethod: "standard",
      saveInfo: false,
      newsletter: false,
    };
  });
  const router = useRouter();
  const requiredFields = [
    "email",
    "firstName",
    "lastName",
    "phone",
    "address",
    // "city",
    // "postalCode",
  ];

  const [isProcessing] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  useEffect(() => {
    setOrderId(uuidv4());
    // const { user } = useAuth();
    console.log("User in useEffect:", userInfo);
    const item = items.find(
      (item) => String(item.productId) === String(selectedProductId)
    );
    setSelectedItem(item);
    console.log("Selected item in useEffect:", selectedItem);
    setInvoiceTotal(Math.round(item ? item.price * item.quantity : 0));

    try {
      let parsed = null;
      const raw =
        typeof window !== "undefined" ? localStorage.getItem("userInfo") : null;
      parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.saveInfo === true) {
        setFormData(() => {
          return {
            email: parsed.email || userInfo?.email || "",
            firstName:
              parsed.firstName ||
              userInfo?.user_metadata?.name?.split(" ")[0] ||
              "",
            lastName:
              parsed.lastName ||
              userInfo?.user_metadata?.name?.split(" ")[1] ||
              "",
            phone: parsed.phone || "",
            address: parsed.address || "",
            // city: parsed.city || "",
            // postalCode: parsed.postalCode || "",
            country: parsed.country || "Vietnam",
            paymentMethod: parsed.paymentMethod || "card",
            shippingMethod: parsed.shippingMethod || "standard",
            saveInfo: true,
            newsletter: parsed.newsletter ?? false,
          };
        });
      }
    } catch (e) {
      console.error("Failed to parse user info:", e);
    }
  }, [selectedProductId, items, userInfo, selectedItem]);
  useEffect(() => {
    setShippingCost(Math.round(invoiceTotal * 0.05));
  }, [invoiceTotal]);
  useEffect(() => {
    setFinalTotal(invoiceTotal + shippingCost);
  }, [invoiceTotal, shippingCost]);

  const handleSaveOrder = () => {
    setOrder({
      MaDH: orderId,
      TenNM: `${formData.firstName} ${formData.lastName}`,
      MaTK_KH: user?.id || "",
      DiaChi: formData.address,
      SoDienThoai: formData.phone,
      SoLuong: selectedItem ? selectedItem.quantity : 0,
      TongTien: finalTotal,
      MaVoucher: voucherCode ? voucherCode : undefined,
      MaSK: suKienUuDais?.MaSK,
      MaCTSP: selectedItem ? selectedItem.productId : "",
    });
  };
  useEffect(() => {
    console.log("Order updated in CheckoutPage:", order);
  }, [order]);
  // Nếu có selectedItem thì chỉ thanh toán mặt hàng đó, nếu không thì thanh toán toàn bộ
  // const invoiceTotal = selectedItem
  //   ? selectedItem.price * selectedItem.quantity
  //   : 0;
  // let shippingCost = invoiceTotal * 0.05;
  // let finalTotal = invoiceTotal + shippingCost;

  // const invoiceData = {
  //   orderId,
  //   customerName: `${formData.firstName} ${formData.lastName}`,
  //   totalAmount: finalTotal.toLocaleString("vi-VN") + "₫",
  //   items: selectedItem
  //     ? {
  //         name: selectedItem.name,
  //         quantity: selectedItem.quantity,
  //         price:
  //           (selectedItem.price * selectedItem.quantity).toLocaleString(
  //             "vi-VN"
  //           ) + "₫",
  //       }
  //     : null,
  // };

  // const [formData, setFormData] = useState(() => {
  //   let parsed = null;
  //   try {
  //     const raw =
  //       typeof window !== "undefined" ? localStorage.getItem("userInfo") : null;
  //     parsed = raw ? JSON.parse(raw) : null;
  //   } catch {}
  //   if (parsed?.saveInfo === true) {
  //     return {
  //       email: parsed.email || user?.email || "",
  //       firstName:
  //         parsed.firstName || user?.user_metadata?.name?.split(" ")[0] || "",
  //       lastName:
  //         parsed.lastName || user?.user_metadata?.name?.split(" ")[1] || "",
  //       phone: parsed.phone || "",
  //       address: parsed.address || "",
  //       // city: parsed.city || "",
  //       // postalCode: parsed.postalCode || "",
  //       country: parsed.country || "Vietnam",
  //       paymentMethod: parsed.paymentMethod || "card",
  //       shippingMethod: parsed.shippingMethod || "standard",
  //       saveInfo: true,
  //       newsletter: parsed.newsletter ?? false,
  //     };
  //   }
  //   return {
  //     email: user?.email || "",
  //     firstName: user?.user_metadata?.name?.split(" ")[0] || "",
  //     lastName: user?.user_metadata?.name?.split(" ")[1] || "",
  //     phone: "",
  //     address: "",
  //     // city: "",
  //     // postalCode: "",
  //     country: "Vietnam",
  //     paymentMethod: "card",
  //     shippingMethod: "standard",
  //     saveInfo: false,
  //     newsletter: false,
  //   };
  // });

  const handleInputChange = (field: string, value: string | boolean) => {
    console.log("Change:", field, value);
    if (field === "saveInfo" && value === false) {
      // Nếu người dùng bỏ chọn lưu thông tin, xóa thông tin đã lưu
      localStorage.removeItem("userInfo");
    } else if (field == "saveInfo" && value == true) {
      const isValid = requiredFields.every(
        (field) => formData[field as keyof typeof formData] !== ""
      );
      if (!isValid) {
        alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenPopup = () => {
    // Validate form before opening popup

    const isValid = requiredFields.every(
      (field) => formData[field as keyof typeof formData] !== ""
    );
    if (!isValid) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleVoucher = async (MaVoucherKH: string) => {
    if (checkVoucher && MaVoucherKH === voucherCodeCustomer) {
      // Nếu mã voucher đã được áp dụng thành công và không thay đổi, không cần gọi API lại
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/voucher-khachhang/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ MaVoucherKH, invoiceTotal }),
        }
      );
      console.log("Response status:", response);
      const data = await response.json();
      console.log("data", data);
      if (response.status === 201) {
        setVoucherCode(data.data.MaVoucher);
        console.log("Voucher applied successfully:", data);
        if (data.type == "FreeShip") {
          setFinalTotal(invoiceTotal);
          setShippingCost(0);
        } else {
          setDiscountAmount(data.data.value);
          setFinalTotal(finalTotal - data.data.value);
        }
        setCheckVoucher(true);
        setVoucherMessage(data.message);
      } else {
        setCheckVoucher(false);
        setVoucherMessage(data.message);
      }
    } catch (error) {
      setCheckVoucher(false);
      setVoucherMessage("Đã xảy ra lỗi khi áp dụng mã giảm giá");
      console.error("Error applying voucher:", error);
    }
  };
  const usdTotal = finalTotal / 25000; // chuyển VNĐ sang USD
  useEffect(() => {
    if (formData.saveInfo) {
      localStorage.setItem("userInfo", JSON.stringify(formData));
    }
  }, [formData, formData.saveInfo]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
          <p className="text-muted-foreground mb-6">
            Thêm sản phẩm vào giỏ hàng để tiếp tục thanh toán
          </p>
          <Button onClick={() => router.push("/products")}>
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Thanh toán</h1>
        <p className="text-muted-foreground">Hoàn tất đơn hàng của bạn</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <form>
            {/* Left Column - Forms */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Thông tin liên hệ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </div>
                  {/* <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={formData.newsletter}
                    onCheckedChange={(checked) =>
                      handleInputChange("newsletter", checked as boolean)
                    }
                  />
                  <Label htmlFor="newsletter" className="text-sm">
                    Đăng ký nhận tin khuyến mãi
                  </Label>
                </div> */}
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Địa chỉ giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Họ *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Tên *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Địa chỉ *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      required
                    />
                  </div>
                  {/* <div className="grid grid-cols-2 gap-4"> */}
                  {/* <div>
                    <Label htmlFor="city">Thành phố *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div> */}
                  {/* <div>
                    <Label htmlFor="postalCode">Mã bưu điện *</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) =>
                        handleInputChange("postalCode", e.target.value)
                      }
                      required
                    />
                  </div> */}
                  {/* </div> */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveInfo"
                      checked={formData.saveInfo}
                      onCheckedChange={(checked) => {
                        handleInputChange("saveInfo", checked);
                      }}
                    />
                    {formData.saveInfo ? (
                      <p className="text-sm text-muted-foreground">
                        Thông tin của bạn sẽ được lưu cho lần mua tiếp theo.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Thông tin của bạn sẽ không được lưu.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tickets className="h-5 w-5" />
                  Áp dụng voucher
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex max-w-lg mx-auto gap-3">
                  <Input
                    placeholder="Nhập mã voucher của bạn..."
                    value={voucherCodeCustomer}
                    onChange={(e) => setvoucherCodeCustomer(e.target.value)}
                    className="border-2 border-gray-300 focus:border-primary shadow-sm text-lg font-medium text-center tracking-wide"
                  />
                  <Button
                    size="lg"
                    onClick={() => handleVoucher(voucherCodeCustomer)}
                    className="bg-primary hover:bg-primary/90 text-white px-6 font-semibold transition-colors"
                  >
                    ÁP DỤNG
                  </Button>
                </div>
                {voucherMessage && (
                  <div
                    className={`mt-2 ${
                      checkVoucher ? "text-green-600 " : "text-red-600 "
                    }`}
                  >
                    {voucherMessage}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {(selectedItem ? [selectedItem] : items).map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-3"
                  >
                    <div className="relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && " • "}
                        {item.color && `Màu: ${item.color}`}
                      </p>
                      <p className="font-medium text-sm">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span> Mã voucher đã dùng: </span>
                  {checkVoucher == true ? (
                    <span className="text-green-600">
                      {voucherCodeCustomer}
                    </span>
                  ) : (
                    <span className="text-red-600">Không hợp lệ</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Sự kiện ưu đãi: </span>
                  <span>{suKienUuDais.TenSK}</span>
                </div>
              </div>
              <Separator />

              {/* Order Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{invoiceTotal.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{shippingCost.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiền giảm</span>
                  <span>{discountAmount.toLocaleString("vi-VN")}₫</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span>{finalTotal.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => {
                  handleOpenPopup();
                  handleSaveOrder();
                }}
                className="w-full"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? "Đang xử lý..." : "Hoàn tất đơn hàng"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Bằng cách đặt hàng, bạn đồng ý với{" "}
                <a href="/return" className="underline">
                  Chính sách đổi trả
                </a>{" "}
                và{" "}
                <a href="/privacy" className="underline">
                  Chính sách bảo mật
                </a>{" "}
                của chúng tôi.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popup Overlay */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleClosePopup}
        >
          <div
            className="relative bg-white p-8 rounded-lg max-w-md w-11/12 max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <X className="absolute top-0 right-0" onClick={handleClosePopup} />
            <h2 className="text-center mb-5 text-xl font-bold">
              Hóa đơn đơn hàng
            </h2>

            {/* Invoice Section */}
            <div className="mb-5">
              <p className="mb-2">
                <strong>Mã đơn hàng:</strong> {orderId}
              </p>
              <p className="mb-3">
                <strong>Khách hàng:</strong> {formData.firstName}{" "}
                {formData.lastName}
              </p>
              <table className="w-full border-collapse mb-3">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">
                      Sản phẩm
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Số lượng
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Giá
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItem
                    ? [selectedItem].map((item, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 p-2">
                            {item.name}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {item.quantity}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {item.price}
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
              <p className="font-bold text-right">
                Tổng tiền: {finalTotal.toLocaleString("vi-VN")}₫
              </p>
            </div>

            {/* Payment Methods */}
            <h3 className="mb-3 font-semibold">Chọn phương thức thanh toán:</h3>
            <div className="flex flex-col gap-3 mb-5">
              <div>
                {PayPal({
                  value: usdTotal.toFixed(2),
                  reference_id: orderId,
                  productDetailId: selectedProductId || "",
                })}
              </div>
              <div>
                <VNPAY
                  amount={finalTotal}
                  orderId={orderId}
                  onPaymentResult={(result) => {
                    console.log("Kết quả thanh toán VNPay:", result);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
