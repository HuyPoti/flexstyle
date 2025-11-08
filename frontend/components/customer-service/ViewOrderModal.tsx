"use client";
import { OrderResponse } from "@/lib/types";
export default function ViewOrderModal({
  open,
  order,
  onClose,
}: {
  open: boolean;
  order: OrderResponse | null;
  onClose: () => void;
}) {
  if (!open || !order) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-1/2 shadow-lg relative w-4/5">
        <button
          className="absolute top-4 right-4 text-gray-500 text-xl hover:text-gray-700"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="font-bold text-lg mb-4">Chi tiết vận chuyển</h2>
        <div className="border p-3 rounded-xl">
          {order.TINHTRANGDONHANG.map((status, index) => (
            <table key={index} className="mb-6 w-full  shadow-sm">
              <thead>
                <tr>
                  <th className="text-left pb-2">Mã đơn hàng</th>
                  <th className="text-left pb-2">Trạng thái</th>
                  <th className="text-left pb-2">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 font-medium">{order.MaDH}</td>
                  <td className="font-semibold flex justify-center py-1 text-xs rounded-lg font-bold items-center">
                    <div
                      className={`py-1 rounded-lg flex justify-center font-bold w-3/4
                        ${
                          status.TrangThai === "CHUA_GIAO"
                            ? "bg-yellow-700 text-white"
                            : status.TrangThai === "DANG_GIAO"
                            ? "bg-blue-400 text-white"
                            : status.TrangThai === "DA_GIAO"
                            ? "bg-green-600 text-white"
                            : status.TrangThai === "LOI"
                            ? "bg-orange-400 text-white"
                            : status.TrangThai === "XAC_NHAN_LOI"
                            ? "bg-pink-700 text-white"
                            : "bg-red-500 text-white"
                        }`}
                    >
                      <div>{status.TrangThai}</div>
                    </div>
                  </td>
                  <td className="text-gray-600">
                    {new Date(status.created_at).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </div>
  );
}
