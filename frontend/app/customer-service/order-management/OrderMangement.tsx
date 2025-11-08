"use client";
import { Button } from "@/components/ui/button";
import { OrderResponse } from "@/lib/types";
import ViewOrderModal from "@/components/customer-service/ViewOrderModal";
import ChangeStatusModal from "@/components/customer-service/ChangeStatusModal";
import HandleIssueModal from "@/components/customer-service/HandleIssueModal";
import {
  CircleCheckBig,
  PencilLine,
  ScanEye,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import axios from "axios";

export default function OrderManagementPage({
  order,
}: {
  order: OrderResponse[];
}) {
  const [orders, setOrders] = useState<OrderResponse[]>(order);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLastPage, setIsLastPage] = useState(order.length < limit);
  const [totalPages] = useState(order.length < limit ? 1 : 2);
  const [searchStatus, setSearchStatus] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [changeStatusOpen, setChangeStatusOpen] = useState(false);
  const [handleIssueOpen, setHandleIssueOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null
  );
  // const [filteredOrders, setFilteredOrders] = useState<OrderResponse[]>(order);
  const supabase = createClient();

  // Cache các trang đã tải
  const [orderCache, setOrderCache] = useState<{
    [key: number]: OrderResponse[];
  }>({ 1: order });

  // Hàm loadOrder cho trang mới
  const loadOrder = async (nextPage: number) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donhang/allOrders?page=${nextPage}&limit=${limit}`
      );
      setOrderCache((prev) => ({ ...prev, [nextPage]: res.data.data }));
      setOrders((prev) => [...prev, ...res.data.data]);
      console.log("Loaded orders for page", nextPage, res.data.data);
      if (res.data.data.length < limit) setIsLastPage(true);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
    }
  };

  const handleNextPage = async () => {
    if (!isLastPage && !orderCache[page + 1]) {
      await loadOrder(page + 1);
    }
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  // Lọc và sắp xếp
  // useEffect(() => {
  //   setFilteredOrders(
  //     orders
  //       .filter((ord) => {
  //         const lastStatus = ord.TINHTRANGDONHANG[0].TrangThai;
  //         const matchStatus = searchStatus ? lastStatus === searchStatus : true;
  //         const matchCustomer = ord.TenNM.toLowerCase().includes(
  //           searchCustomer.toLowerCase()
  //         );
  //         const matchProduct =
  //           ord.CHITIETSANPHAM.SANPHAM.TenSP.toLowerCase().includes(
  //             searchProduct.toLowerCase()
  //           );
  //         return matchStatus && matchCustomer && matchProduct;
  //       })
  //       .sort((a, b) => {
  //         const aStatus = a.TINHTRANGDONHANG[0].TrangThai;
  //         const bStatus = b.TINHTRANGDONHANG[0].TrangThai;
  //         // Định nghĩa thứ tự ưu tiên
  //         const statusOrder = [
  //           "LOI",
  //           "XAC_NHAN_LOI",
  //           "CHUA_GIAO",
  //           "DANG_GIAO",
  //           "DA_GIAO",
  //           "HUY",
  //         ];
  //         const aIndex = statusOrder.indexOf(aStatus);
  //         const bIndex = statusOrder.indexOf(bStatus);
  //         return aIndex - bIndex;
  //       })
  //   );
  // }, [orders, searchStatus, searchCustomer, searchProduct]);

  // pageOrder là slice của orders
  const pageOrder = orders.slice((page - 1) * limit, page * limit);

  // Modal xem chi tiết

  // Modal đổi trạng thái

  // Modal xử lý vấn đề

  // Hàm mở modal
  const openViewModal = (order: OrderResponse) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };
  const openChangeStatusModal = (order: OrderResponse) => {
    setSelectedOrder(order);
    setChangeStatusOpen(true);
  };
  const openHandleIssueModal = (order: OrderResponse) => {
    setSelectedOrder(order);
    setHandleIssueOpen(true);
  };

  // Hàm xử lý modal
  const closeAllModals = () => {
    setViewModalOpen(false);
    setChangeStatusOpen(false);
    setHandleIssueOpen(false);
    setSelectedOrder(null);
  };
  const handleChangeStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    if (
      selectedOrder.TINHTRANGDONHANG[0].TrangThai === "CHUA_GIAO" &&
      ["CHUA_GIAO", "DA_GIAO", "XAC_NHAN_LOI", "HUY"].includes(newStatus)
    ) {
      alert("Không thể chuyển trạng thái từ CHUA_GIAO sang trạng thái này");
      return;
    }
    if (
      selectedOrder.TINHTRANGDONHANG[0].TrangThai === "DANG_GIAO" &&
      ["CHUA_GIAO", "DANG_GIAO", "XAC_NHAN_LOI", "HUY"].includes(newStatus)
    ) {
      alert("Không thể chuyển trạng thái từ ĐANG_GIAO sang trạng thái này");
      return;
    }
    if (
      selectedOrder.TINHTRANGDONHANG[0].TrangThai === "DA_GIAO" &&
      [
        "CHUA_GIAO",
        "DANG_GIAO",
        "DA_GIAO",
        "HUY",
        "XAC_NHAN_LOI",
        "LOI",
      ].includes(newStatus)
    ) {
      alert("Không thể chuyển trạng thái từ DA_GIAO sang trạng thái này");
      return;
    }
    if (
      selectedOrder.TINHTRANGDONHANG[0].TrangThai === "XAC_NHAN_LOI" &&
      ["CHUA_GIAO", "DA_GIAO", "DANG_GIAO", "LOI", "XAC_NHAN_LOI"].includes(
        newStatus
      )
    ) {
      alert("Không thể chuyển trạng thái từ XAC_NHAN_LOI sang trạng thái này");
      return;
    }
    if (
      selectedOrder.TINHTRANGDONHANG[0].TrangThai === "HUY" &&
      [
        "CHUA_GIAO",
        "DA_GIAO",
        "DANG_GIAO",
        "LOI",
        "XAC_NHAN_LOI",
        "HUY",
      ].includes(newStatus)
    ) {
      alert("Không thể chuyển trạng thái từ HUY sang trạng thái này");
      return;
    }

    // TODO: Gọi API đổi trạng thái
    const { data } = await supabase.auth.getSession();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donhang/status/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.session?.access_token}`,
        },
        body: JSON.stringify({
          MaDH: selectedOrder.MaDH,
          TrangThai: newStatus,
        }),
      }
    );
    if (response.ok) {
      alert("Đổi trạng thái thành công");
      // Cập nhật lại trạng thái trong danh sách
      setOrders((prevOrders) =>
        prevOrders.map((ord) =>
          ord.MaDH === selectedOrder.MaDH
            ? {
                ...ord,
                TINHTRANGDONHANG: [
                  {
                    ...ord.TINHTRANGDONHANG[ord.TINHTRANGDONHANG.length - 1],
                    TrangThai: newStatus,
                    created_at: new Date().toISOString(),
                  },
                  ...ord.TINHTRANGDONHANG,
                ],
              }
            : ord
        )
      );
      //thêm trạng thái vào cache
      setOrderCache((prevCache) => {
        const updatedCache = { ...prevCache };
        Object.keys(updatedCache).forEach((pageKey) => {
          updatedCache[Number(pageKey)] = updatedCache[Number(pageKey)].map(
            (ord) =>
              ord.MaDH === selectedOrder.MaDH
                ? {
                    ...ord,
                    TINHTRANGDONHANG: [
                      {
                        ...ord.TINHTRANGDONHANG[
                          ord.TINHTRANGDONHANG.length - 1
                        ],
                        TrangThai: newStatus,
                        created_at: Date.now().toLocaleString(), // hoặc thời gian thực tế
                      },
                    ],
                  }
                : ord
          );
        });
        return updatedCache;
      });
      closeAllModals();
    } else {
      alert("Đổi trạng thái thất bại");
    }
  };
  const handleHandleIssue = async (newStatus: string) => {
    // TODO: Gọi API xử lý vấn đề
    if (!selectedOrder) return;
    if (
      selectedOrder.TINHTRANGDONHANG[0].TrangThai === "LOI" &&
      ["CHUA_GIAO", "DA_GIAO", "LOI", "HUY"].includes(newStatus)
    ) {
      alert("Không thể chuyển trạng thái từ LOI sang trạng thái này");
      return;
    }
    const { data } = await supabase.auth.getSession();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donhang/status/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.session?.access_token}`,
        },
        body: JSON.stringify({
          MaDH: selectedOrder.MaDH,
          TrangThai: newStatus,
        }),
      }
    );
    if (response.ok) {
      alert("Xử lý thành công");
      // Cập nhật lại trạng thái trong danh sách
      setOrders((prevOrders) =>
        prevOrders.map((ord) =>
          ord.MaDH === selectedOrder.MaDH
            ? {
                ...ord,
                TINHTRANGDONHANG: [
                  {
                    ...ord.TINHTRANGDONHANG[ord.TINHTRANGDONHANG.length - 1],
                    TrangThai: newStatus,
                    created_at: new Date().toISOString(),
                  },
                  ...ord.TINHTRANGDONHANG,
                ],
              }
            : ord
        )
      );
      //thêm trạng thái vào cache
      setOrderCache((prevCache) => {
        const updatedCache = { ...prevCache };
        Object.keys(updatedCache).forEach((pageKey) => {
          updatedCache[Number(pageKey)] = updatedCache[Number(pageKey)].map(
            (ord) =>
              ord.MaDH === selectedOrder.MaDH
                ? {
                    ...ord,
                    TINHTRANGDONHANG: [
                      {
                        ...ord.TINHTRANGDONHANG[
                          ord.TINHTRANGDONHANG.length - 1
                        ],
                        TrangThai: newStatus,
                        created_at: Date.now().toLocaleString(), // hoặc thời gian thực tế
                      },
                    ],
                  }
                : ord
          );
        });
        closeAllModals();

        return updatedCache;
      });
      closeAllModals();
    } else {
      alert("Xử lý thất bại");
    }
    closeAllModals();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Tìm trạng thái..."
            className="border rounded px-2 py-1 text-sm"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tên khách hàng..."
            className="border rounded px-2 py-1 text-sm"
            value={searchCustomer}
            onChange={(e) => setSearchCustomer(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tên sản phẩm..."
            className="border rounded px-2 py-1 text-sm"
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <button
            className="px-2 py-1 border rounded bg-gray-100"
            disabled={page === 1}
            onClick={handlePrevPage}
          >
            &lt;
          </button>
          <span>
            Trang {page} / {totalPages}
          </span>
          <button
            className="px-2 py-1 border rounded bg-gray-100"
            disabled={isLastPage && page === totalPages}
            onClick={handleNextPage}
          >
            &gt;
          </button>
          <input
            type="number"
            min={1}
            max={100}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-16 border rounded px-2 py-1 text-sm ml-2"
          />
          <span className="text-xs">/ trang</span>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-4">Danh sách đơn hàng</h2>
        <table className="min-w-full text-sm border-t border-gray-200">
          <thead className="bg-gray-100 text-gray-700 font-medium">
            <tr>
              <th className="px-4 py-2">Mã đơn</th>
              <th className="px-4 py-2">Sản phẩm</th>
              <th className="px-4 py-2">Số lượng</th>
              <th className="px-4 py-2">Tên Khách hàng</th>
              <th className="px-4 py-2">Thời gian cập nhật</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2">Vấn đề</th>
              <th className="px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pageOrder.map((order: OrderResponse) => (
              <tr key={order.MaDH} className="border-b">
                <td className="px-4 py-2">{order.MaDH}</td>
                <td className="px-4 py-2">
                  {order.CHITIETSANPHAM.SANPHAM.TenSP}
                </td>
                <td className="px-4 py-2">{order.SoLuong}</td>
                <td className="px-4 py-2">{order.TenNM}</td>
                <td className="px-4 py-2">
                  {order.TINHTRANGDONHANG[0].created_at}
                </td>
                <td className="px-4 py-2">
                  <div
                    className={`px-3 py-1 text-xs rounded-lg flex justify-center font-bold
              ${
                order.TINHTRANGDONHANG[0].TrangThai === "CHUA_GIAO"
                  ? "bg-yellow-700 text-white"
                  : order.TINHTRANGDONHANG[0].TrangThai === "DANG_GIAO"
                  ? "bg-blue-400 text-white"
                  : order.TINHTRANGDONHANG[0].TrangThai === "DA_GIAO"
                  ? "bg-green-600 text-white"
                  : order.TINHTRANGDONHANG[0].TrangThai === "LOI"
                  ? "bg-orange-400 text-white"
                  : order.TINHTRANGDONHANG[0].TrangThai === "XAC_NHAN_LOI"
                  ? "bg-pink-700 text-white"
                  : "bg-red-500 text-white"
              }`}
                  >
                    {order.TINHTRANGDONHANG[0].TrangThai}
                  </div>
                </td>
                <td className="px-4 py-2 ">
                  <div className="flex justify-center items-center">
                    {order.TINHTRANGDONHANG[0].TrangThai !== "LOI" &&
                    order.TINHTRANGDONHANG[0].TrangThai !== "XAC_NHAN_LOI" ? (
                      <span className="text-green-500">
                        <CircleCheckBig />
                      </span>
                    ) : (
                      <TriangleAlert className="text-red-500" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 ">
                  {order.TINHTRANGDONHANG[0].TrangThai === "LOI" ? (
                    <div className="rounded flex justify-center">
                      <Button
                        className="bg-red-500 text-white px-3 py-1 "
                        onClick={() => openHandleIssueModal(order)}
                      >
                        <span>
                          <TriangleAlert />
                        </span>{" "}
                        Xử lý
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded flex justify-center gap-3">
                      <Button
                        className="bg-white-500 text-black px-3 py-1 "
                        onClick={() => openViewModal(order)}
                      >
                        <ScanEye />
                        Xem
                      </Button>
                      {order.TINHTRANGDONHANG[0].TrangThai === "HUY" ? null : (
                        <Button
                          className="bg-yellow-500 text-black px-3 py-1 "
                          onClick={() => openChangeStatusModal(order)}
                        >
                          <PencilLine />
                          Đổi trạng thái
                        </Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ChangeStatusModal
        open={changeStatusOpen}
        order={selectedOrder}
        onClose={closeAllModals}
        onChange={handleChangeStatus}
      />
      <HandleIssueModal
        open={handleIssueOpen}
        order={selectedOrder}
        onClose={closeAllModals}
        onHandle={handleHandleIssue}
      />
      <ViewOrderModal
        open={viewModalOpen}
        order={selectedOrder}
        onClose={closeAllModals}
      />
    </div>
  );
}
