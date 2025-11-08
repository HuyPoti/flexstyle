"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import Receipt from "../supplier/Receipt";
import { ReceiptData } from "@/interfaces/receipt";
import axios from "axios";

interface NccTableProps {
  nccs: ReceiptData[];
  onDelete?: (id: string) => void;
}

// Component hiển thị bảng đánh giá / phản hồi
export default function NccTable({ nccs, onDelete }: NccTableProps) {
  const [selectedPnh, setSelectedPnh] = useState<ReceiptData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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
              <th className="text-left px-4 py-2">Nhập tại kho</th>
              <th className="text-left px-4 py-2">Địa chỉ</th>
              <th className="text-left px-4 py-2">Trạng thái</th>
              <th className="text-left px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          {/* body bảng phản hồi */}
          <tbody>
            {nccs.map((f, idx) => (
              <tr
                key={f.MaPNH ?? idx}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 text-left">
                  {formatDate(f.created_at)}
                </td>
                <td className="px-4 py-2 text-left">FlexStyle</td>
                <td className="px-4 py-2 text-left">Phường Chợ Quán, TP.HCM</td>
                <td className="px-4 py-2 text-left">
                  <Badge
                    className={`${
                      f.TrangThai === "NV_XACNHAN"
                        ? "bg-green-600"
                        : f.TrangThai === "NCC_XACNHAN"
                        ? "bg-blue-600"
                        : f.TrangThai === "DANG_CHO"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    } hover:${
                      f.TrangThai === "NV_XACNHAN"
                        ? "bg-green-300"
                        : f.TrangThai === "NCC_XACNHAN"
                        ? "bg-blue-300"
                        : f.TrangThai === "DANG_CHO"
                        ? "bg-yellow-300"
                        : "bg-red-300"
                    } cursor-default text-white`}
                  >
                    {f.TrangThai}
                  </Badge>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 hover:bg-green-100 hover:text-green-600"
                    onClick={() => {
                      setSelectedPnh(f);
                      setIsOpen(true);
                    }}
                  >
                    Chi tiết
                  </Button>
                  {f.TrangThai === "DANG_CHO" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 hover:bg-red-100 hover:text-red-600"
                      onClick={() => onDelete?.(f.MaPNH || "")}
                    >
                      <Trash2 className="w-4 h-4" />
                      Từ chối
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isOpen && selectedPnh && (
        <Receipt
          initial={selectedPnh}
          onAgree={async () => {
            await axios.put(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phieunhaphang/${selectedPnh.MaPNH}/nhacungcapxacnhan`,
              {
                NoiDung: "NCC_XACNHAN",
              }
            );
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
