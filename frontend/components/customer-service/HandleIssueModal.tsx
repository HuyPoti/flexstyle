"use client";

import { OrderResponse } from "@/lib/types";
export default function HandleIssueModal({
  open,
  order,
  onClose,
  onHandle,
}: {
  open: boolean;
  order: OrderResponse | null;
  onClose: () => void;
  onHandle: (note: string) => void;
}) {
  if (!open || !order) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[500px] shadow-lg">
        <h2 className="font-bold text-lg mb-4">Xử lý vấn đề đơn hàng</h2>
        <div>
          <span className="font-bold text-purple-500 text-lg">Mã đơn:</span>{" "}
          {order.MaDH}
        </div>
        <div>
          <span className="font-bold text-purple-500 text-lg">Khách hàng:</span>{" "}
          {order.TenNM}
        </div>
        <div>
          <span className="font-bold text-purple-500 text-lg">
            Số điện thoại:
          </span>{" "}
          {order.SoDienThoai}
        </div>
        <div>
          <span className="font-bold text-purple-500 text-lg">Địa chỉ:</span>{" "}
          {order.DiaChi}
        </div>
        <div>
          <span className="font-bold text-purple-500 text-lg">
            Tên sản phẩm:
          </span>{" "}
          {order.CHITIETSANPHAM.SANPHAM.TenSP}
        </div>
        <div>
          <span className="font-bold text-purple-500 text-lg">Số SP:</span>{" "}
          {order.SoLuong}
        </div>
        <div>
          <span className="font-bold text-purple-500 text-lg">Thời gian:</span>{" "}
          {new Date(order.created_at).toLocaleString()}
        </div>
        <div>
          <span className="font-bold text-purple-500 text-lg">Tổng tiền:</span>{" "}
          {order.TongTien?.toLocaleString()}
        </div>
        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => onHandle("XAC_NHAN_LOI")}
          >
            Xử lý
          </button>
        </div>
      </div>
    </div>
  );
}
