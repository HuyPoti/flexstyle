"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  Bug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
// import { getUserOrders } from "@/lib/data";
import { formatPrice } from "@/lib/help";
import type { OrderResponse } from "@/lib/types";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function OrdersPage({
  initialOrderData,
}: {
  initialOrderData?: { orders: OrderResponse[]; total: number };
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      // const userOrders = getUserOrders(user.id);
      setOrders(initialOrderData?.orders || []);
      setFilteredOrders(initialOrderData?.orders || []);
    }
    console.log("User orders:", orders);
  }, [user, initialOrderData?.orders, orders]);

  useEffect(() => {
    let filtered = orders;

    // Filter by search query
    if (searchQuery) {
      //tìm kiếm theo tên sản phẩm
      filtered = filtered.filter((order) =>
        order.CHITIETSANPHAM.SANPHAM.TenSP.toLowerCase().includes(
          searchQuery.toLowerCase()
        )
      );
    }

    // Filter by status
    if (statusFilter !== "all" && statusFilter !== "LOI") {
      filtered = filtered.filter(
        (order) => order.TINHTRANGDONHANG[0].TrangThai === statusFilter
      );
    } else if (statusFilter === "LOI") {
      filtered = filtered.filter(
        (order) =>
          order.TINHTRANGDONHANG[0].TrangThai === "LOI" ||
          order.TINHTRANGDONHANG[0].TrangThai === "XAC_NHAN_LOI"
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  const getStatusIcon = (
    status: OrderResponse["TINHTRANGDONHANG"][0]["TrangThai"]
  ) => {
    switch (status) {
      case "CHUA_GIAO":
        return <Package className="h-4 w-4" />;
      case "DANG_GIAO":
        return <Truck className="h-4 w-4" />;
      case "DA_GIAO":
        return <CheckCircle className="h-4 w-4" />;
      case "HUY":
        return <XCircle className="h-4 w-4" />;
      case "LOI":
      case "XAC_NHAN_LOI":
        return <Bug className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (
    status: OrderResponse["TINHTRANGDONHANG"][0]["TrangThai"]
  ) => {
    switch (status) {
      case "CHUA_GIAO":
        return "bg-yellow-500";
      case "DANG_GIAO":
        return "bg-blue-500";
      case "DA_GIAO":
        return "bg-green-500";
      case "HUY":
        return "bg-red-500";
      case "LOI":
      case "XAC_NHAN_LOI":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (
    status: OrderResponse["TINHTRANGDONHANG"][0]["TrangThai"]
  ) => {
    switch (status) {
      case "CHUA_GIAO":
        return "Chờ giao hàng";
      case "DANG_GIAO":
        return "Đang giao hàng";
      case "DA_GIAO":
        return "Đã giao hàng";
      case "HUY":
        return "Đã hủy";
      case "LOI":
      case "XAC_NHAN_LOI":
        return "Lỗi";
      default:
        return status;
    }
  };

  const ordersByStatus = {
    all: filteredOrders,
    CHUA_GIAO: filteredOrders.filter(
      (order) => order.TINHTRANGDONHANG[0].TrangThai === "CHUA_GIAO"
    ),
    DANG_GIAO: filteredOrders.filter(
      (order) => order.TINHTRANGDONHANG[0].TrangThai === "DANG_GIAO"
    ),
    DA_GIAO: filteredOrders.filter(
      (order) => order.TINHTRANGDONHANG[0].TrangThai === "DA_GIAO"
    ),
    HUY: filteredOrders.filter(
      (order) => order.TINHTRANGDONHANG[0].TrangThai === "HUY"
    ),
    LOI: filteredOrders.filter(
      (order) => order.TINHTRANGDONHANG[0].TrangThai === "LOI"
    ),
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý các đơn hàng của bạn
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="CHUA_GIAO">Chờ giao</SelectItem>
              <SelectItem value="DANG_GIAO">Đang giao</SelectItem>
              <SelectItem value="DA_GIAO">Đã giao</SelectItem>
              <SelectItem value="HUY">Đã hủy</SelectItem>
              <SelectItem value="LOI">Lỗi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          {/* <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">
              Tất cả ({ordersByStatus.all.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Chờ xử lý ({ordersByStatus.pending.length})
            </TabsTrigger>
            <TabsTrigger value="processing">
              Đang xử lý ({ordersByStatus.processing.length})
            </TabsTrigger>
            <TabsTrigger value="shipped">
              Đang giao ({ordersByStatus.shipped.length})
            </TabsTrigger>
            <TabsTrigger value="delivered">
              Đã giao ({ordersByStatus.delivered.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Đã hủy ({ordersByStatus.cancelled.length})
            </TabsTrigger>
          </TabsList> */}

          {Object.entries(ordersByStatus).map(([status, statusOrders]) => (
            <TabsContent key={status} value={status}>
              {statusOrders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {status === "all"
                        ? "Bạn chưa có đơn hàng nào"
                        : `Không có đơn hàng ${getStatusText(
                            status as OrderResponse["TINHTRANGDONHANG"][0]["TrangThai"]
                          ).toLowerCase()}`}
                    </p>
                    <Button asChild>
                      <Link href="/products">Bắt đầu mua sắm</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {statusOrders.map((order) => (
                    <Card key={order.MaDH}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              Đơn hàng #{order.MaDH}
                            </CardTitle>
                            <CardDescription>
                              Đặt ngày{" "}
                              {new Date(order.created_at).toLocaleDateString(
                                "vi-VN"
                              )}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`flex items-center gap-1 font-bold text-sm text-black ${getStatusColor(
                                order.TINHTRANGDONHANG[0].TrangThai
                              )}`}
                            >
                              {getStatusIcon(
                                order.TINHTRANGDONHANG[0].TrangThai
                              )}
                              {getStatusText(
                                order.TINHTRANGDONHANG[0].TrangThai
                              )}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowDetail(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Chi tiết
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* <div className="space-y-4"> */}
                        {/* Order Items */}
                        <div className="space-y-2">
                          {Array.isArray(order.CHITIETSANPHAM) ? (
                            order.CHITIETSANPHAM.slice(0, 2).map((ctsp) => (
                              <div
                                key={ctsp.MaCTSP}
                                className="flex items-center gap-4"
                              >
                                <Image
                                  src={"https:" + ctsp.SANPHAM.HinhAnh[0]}
                                  alt={ctsp.SANPHAM.TenSP}
                                  width={100}
                                  height={100}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                  <p className="font-medium">
                                    {ctsp.SANPHAM.TenSP}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Số lượng: {ctsp.SoLuong}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center gap-4">
                              <Image
                                width={100}
                                height={100}
                                src={
                                  "https:" +
                                  order.CHITIETSANPHAM.SANPHAM.HinhAnh[0]
                                }
                                alt={order.CHITIETSANPHAM.SANPHAM.TenSP}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium">
                                  {order.CHITIETSANPHAM.SANPHAM.TenSP}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Số lượng: {order.SoLuong}
                                </p>
                              </div>
                            </div>
                          )}
                          {Array.isArray(order.CHITIETSANPHAM) &&
                            order.CHITIETSANPHAM.length > 2 && (
                              <p className="text-sm text-muted-foreground">
                                Và {order.CHITIETSANPHAM.length - 2} sản phẩm
                                khác...
                              </p>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-4 text-right">
                          <p className="font-semibold">
                            Tổng cộng: {formatPrice(order.TongTien)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      {/* Popup chi tiết đơn hàng */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-lg border-4 border-purple-400 bg-white shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-purple-500">
              Chi tiết đơn hàng
            </DialogTitle>
            <DialogClose />
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-2">
              <div className="font-semibold">
                Tên người mua: {selectedOrder.TenNM || ""}
              </div>
              <div className="ml-5">
                <div>Số điện thoại: {selectedOrder.SoDienThoai || ""}</div>
                <div>Địa chỉ: {selectedOrder.DiaChi || ""}</div>
              </div>

              <div className="font-semibold mt-2">Sản phẩm:</div>
              <div className="border rounded p-2 mb-2 border-yellow-300">
                <div>
                  Tên sản phẩm: {selectedOrder.CHITIETSANPHAM.SANPHAM.TenSP}
                </div>
                <div>Số lượng: {selectedOrder.SoLuong}</div>
                <div>
                  Màu sắc: {selectedOrder.CHITIETSANPHAM.SANPHAM.MauSac}
                </div>
                <div>Kích cỡ: {selectedOrder.CHITIETSANPHAM.KichCo}</div>
              </div>
              <Separator className="bg-purple-300" />
              <div>
                Phí vận chuyển:{" "}
                {formatPrice(Math.round(selectedOrder.TongTien / 21))}
              </div>
              <div className="font-semibold">
                Tổng tiền: {formatPrice(selectedOrder.TongTien)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
