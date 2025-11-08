"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Star } from "lucide-react";
import { PhanHoiForNV } from "@/lib/types";


interface FeedbackTableProps {
  feedbacks: PhanHoiForNV[];
  onDelete?: (id: string) => void;
}

// Component hiển thị bảng đánh giá / phản hồi
export default function FeedbackTable({
  feedbacks,
  onDelete,
}: FeedbackTableProps) {
  // Hàm định dạng ngày tháng
  const formatDate = (d?: string | Date) => {
    if (!d) return "-";
    const dt = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(dt.getTime())) return "-";
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(dt);
  };

  return (
    <div className="bg-gray-50 rounded-xl border p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Danh sách đánh giá
        </h2>
        <p className="text-sm text-gray-500">
          Quản lý phản hồi / đánh giá khách hàng
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-t border-gray-200 table-fixed">
          <colgroup>
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead className="bg-gray-100 text-gray-700 font-medium ">
            <tr className="border-b">
              <th className="text-left px-4 py-2">Ngày cập nhật</th>
              <th className="text-left px-4 py-2">Tên khách hàng</th>
              <th className="text-left px-4 py-2">Tên sản phẩm</th>
              <th className="text-left px-4 py-2">Số sao</th>
              <th className="text-left px-4 py-2">Bình luận</th>
              <th className="text-left px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          {/* body bảng phản hồi */}
          <tbody>
            {feedbacks.map((f, idx) => (
              <tr
                key={f.MaPH ?? idx}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 text-left">
                  {formatDate(f.updated_at)}
                </td>
                <td className="px-4 py-2 text-gray-600 text-left">
                  {f.TAIKHOAN?.Username ?? "-"}
                </td>
                <td className="px-4 py-2 text-gray-600 text-left">
                  {f.SANPHAM.TenSP ?? "-"}
                </td>
                <td className="px-4 py-2 text-left">
                  {typeof f.SoSao === "number" ? (
                    <div
                      className="flex items-center gap-1"
                      aria-label={`Rating: ${f.SoSao} out of 5`}
                    >
                      {Array.from({ length: 5 }, (_, i) => {
                        const idx = i + 1;
                        return (
                          <Star
                            key={idx}
                            className={`w-4 h-4 ${
                              idx <= (f.SoSao ?? 0)
                                ? "text-amber-400"
                                : "text-gray-200"
                            }`}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-4 py-2 text-gray-800 text-left">
                  {f.BinhLuan ?? "-"}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 hover:bg-red-100 hover:text-red-600"
                    onClick={() => onDelete?.(f.MaPH)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
