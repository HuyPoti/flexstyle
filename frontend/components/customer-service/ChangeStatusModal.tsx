"use client";
import { useState, useEffect } from "react";
import { OrderResponse } from "@/lib/types";

export default function ChangeStatusModal({
  open,
  order,
  onClose,
  onChange,
}: {
  open: boolean;
  order: OrderResponse | null;
  onClose: () => void;
  onChange: (newStatus: string) => void;
}) {
  const [status, setStatus] = useState(
    order?.TINHTRANGDONHANG?.[0]?.TrangThai || ""
  );
  // Nếu order thay đổi, cập nhật lại trạng thái mặc định
  useEffect(() => {
    setStatus(order?.TINHTRANGDONHANG?.[0]?.TrangThai || "");
  }, [order]);
  if (!open || !order) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 bt-15">
      <div className="bg-white rounded-xl p-6 w-[350px] shadow-lg">
        <h2 className="font-bold text-lg mb-4">Đổi trạng thái đơn hàng</h2>
        <select
          className="w-full border rounded px-2 py-2 mb-4"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="CHUA_GIAO">Chưa giao</option>
          <option value="DANG_GIAO">Đang giao hàng</option>
          <option value="DA_GIAO">Đã giao hàng</option>
          <option value="LOI">Bị lỗi</option>
          <option value="HUY">Hủy</option>
        </select>
        <div className="flex gap-2 justify-end">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => onChange(status)}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
