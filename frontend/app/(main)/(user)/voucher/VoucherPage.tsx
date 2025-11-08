"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Gift,
  Percent,
  Calendar,
  Copy,
  Check,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { Voucher_KhachHang } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";

export default function VoucherPage({
  initialProducts,
}: {
  initialProducts: Voucher_KhachHang[];
}) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const user = useAuth();
  const [voucher, setVoucher] = useState<Voucher_KhachHang[]>(
    []
  );
  useEffect(() => {
    setVoucher(initialProducts.filter((v) => {console.log(v); return v.TrangThai == "ACTIVE"}));
  }, [initialProducts]);
  const [applyVoucher, setApplyVoucher] = useState<boolean>(false);
  const [inforMessage, setInformMessage] = useState<string>("");
  const handleVoucherCode = async (code: string) => {
    const voucherCode = code.toUpperCase();
    const respone = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/voucher/code/${voucherCode}`,
      { cache: "no-store" }
    );
    const voucher = await respone.json();
    console.log(voucher.message);
    if (voucher.statusCode === 200 && voucher.data) {
      const resultAdd = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/voucher-khachhang/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          MaKH: user.user?.id,
          MaVoucher: voucher.data.MaVoucher,
        }),
      });
      const resultAddJson = await resultAdd.json();
      setInformMessage(resultAddJson.message);
      console.log(resultAddJson);
      if (resultAddJson.statusCode == 201 && resultAddJson.data) {
        setApplyVoucher(true);
      } else {
        setApplyVoucher(false);
      }
    } else {
      setInformMessage(voucher.message);
      setApplyVoucher(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 20000);
  };

  const getVoucherIcon = (type: string) => {
    switch (type) {
      case "new-member":
        return <Users className="h-5 w-5" />;
      case "percentage":
        return <Percent className="h-5 w-5" />;
      case "shipping":
        return <Gift className="h-5 w-5" />;
      case "vip":
        return <Star className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  const getVoucherColor = (type: string) => {
    switch (type) {
      case "GiamGia":
        return "bg-green-500";
      case "FreeShip":
        return "bg-yellow-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="mb-4">MÃ GIẢM GIÁ</Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Voucher <span className="text-primary">Ưu Đãi</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Khám phá những mã giảm giá hấp dẫn và tiết kiệm chi phí mua sắm. Cập
          nhật liên tục các chương trình khuyến mãi đặc biệt dành riêng cho bạn.
        </p>
      </div>

      {/* Voucher Input */}
      <Card className="mb-16 shadow-lg border border-gray-200 bg-white">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-xl text-gray-900">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Zap className="h-5 w-5" />
            </div>
            Nhập Mã Voucher
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <div className="flex max-w-lg mx-auto gap-3">
            <Input
              placeholder="Nhập mã voucher của bạn..."
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="uppercase border-2 border-gray-300 focus:border-primary shadow-sm text-lg font-medium h-12 text-center tracking-wide"
            />
            <Button
              size="lg"
              onClick={() => handleVoucherCode(voucherCode)}
              className="bg-primary hover:bg-primary/90 text-white h-12 px-6 font-semibold transition-colors"
            >
              ÁP DỤNG
            </Button>
          </div>
          {/* Thông điệp thành công */}

          <p
            className={
              applyVoucher
                ? "text-center text-green-600 font-medium mt-4 text-lg"
                : "text-center text-red-600 font-medium mt-4 text-lg"
            }
          >
            {inforMessage}
          </p>
          <p className="text-center text-sm text-gray-500 mt-4">
            💫 Nhập mã voucher để nhận ưu đãi đặc biệt ngay lập tức
          </p>
        </CardContent>
      </Card>

      {/* Active Vouchers */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Mã Giảm Giá Đang Có Hiệu Lực
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {voucher.length > 0 ? (
            voucher.map((voucher) =>
              voucher.TrangThai == "ACTIVE" &&
              new Date(voucher.Hsd) > new Date() ? (
                <Card key={voucher.MaVCKH} className="relative overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 w-2 h-full ${getVoucherColor(
                      voucher.voucherDetails?.Loai || "gift"
                    )}`}
                  ></div>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${getVoucherColor(
                            voucher.voucherDetails?.Loai || "gift"
                          )} text-white`}
                        >
                          {getVoucherIcon(
                            voucher.voucherDetails?.Loai || "gift"
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {voucher.voucherDetails?.TenVoucher}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {voucher.voucherDetails?.MoTa}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        {voucher.voucherDetails?.Loai === "GiamGia" ? (
                          <h3 className="text-2xl font-bold text-green-600">
                            Giảm{" "}
                            {voucher.voucherDetails?.SoTien?.toLocaleString()}₫
                          </h3>
                        ) : (
                          <h3
                            className={`text-2xl font-bold ${
                              voucher.voucherDetails?.Loai === "FreeShip"
                                ? "text-yellow-500"
                                : "text-green-600"
                            }`}
                          >
                            {voucher.voucherDetails?.Loai === "GiamGia"
                              ? `Giảm ${voucher.voucherDetails?.SoTien?.toLocaleString()}₫`
                              : `Free Ship miễn phí trên toàn quốc`}
                          </h3>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Đơn tối thiểu: {voucher.voucherDetails?.Dieukien}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            HSD:{" "}
                            {new Date(voucher.Hsd) < new Date() ? (
                              <span className="text-red-500 font-semibold">
                                Đã hết hạn
                              </span>
                            ) : (
                              <span>
                                {new Date(voucher.Hsd).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <code className="flex-1 font-mono font-bold text-lg">
                        {voucher.MaVCKH}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleCopyCode(
                            voucher.MaVCKH || ""
                          )
                        }
                        className="flex items-center gap-1"
                      >
                        {copiedCode === voucher.MaVCKH ? (
                          <>
                            <Check className="h-4 w-4" />
                            Đã copy
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null
            )
          ) : (
            <p className="text-center text-gray-500 col-span-2">
              Hiện không có voucher nào đang hoạt động.
            </p>
          )}
        </div>
      </div>

      <Separator className="my-16" />

      {/* Expired Vouchers */}

      {/* How to Use */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Cách Sử Dụng Voucher
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              step: "1",
              title: "Chọn sản phẩm",
              description: "Thêm sản phẩm yêu thích vào giỏ hàng",
            },
            {
              step: "2",
              title: "Vào giỏ hàng",
              description: "Kiểm tra sản phẩm và số lượng",
            },
            {
              step: "3",
              title: "Nhập mã voucher",
              description: "Nhập mã vào ô 'Mã giảm giá' và nhấn áp dụng",
            },
            {
              step: "4",
              title: "Hoàn tất thanh toán",
              description: "Kiểm tra giá đã giảm và thanh toán",
            },
          ].map((step, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Điều Kiện Sử Dụng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>• Mỗi voucher chỉ được sử dụng một lần cho mỗi tài khoản</p>
          <p>• Không áp dụng đồng thời nhiều voucher cho một đơn hàng</p>
          <p>• Voucher không có giá trị quy đổi thành tiền mặt</p>
          <p>• FlexStyle có quyền thay đổi điều kiện mà không cần báo trước</p>
          <p>• Voucher không áp dụng cho sản phẩm đã giảm giá trên 50%</p>
          <p>• Liên hệ CSKH nếu gặp vấn đề khi sử dụng voucher</p>
        </CardContent>
      </Card>
    </div>
  );
}
