"use client";

import { SquarePen, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Product from "@/interfaces/product";
import Image from "next/image";
interface ProductTableProps {
  products: Product[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView: (id: string) => void;
}
export default function ProductTable({
  products,
  onEdit,
  onView,
}: ProductTableProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function toggleExpand(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }
  const loaiMap = {
    AO: "Áo",
    QUAN: "Quần",
    PHU_KIEN: "Phụ kiện",
  };
  return (
    <div className="bg-gray-50 rounded-xl border p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Danh sách sản phẩm
        </h2>
        <p className="text-sm text-gray-500">Quản lý thông tin sản phẩm</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-t border-gray-200 table-fixed">
          <colgroup>
            <col style={{ width: "1%" }} />
            <col style={{ width: "28%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "17%" }} />
          </colgroup>
          <thead className="bg-gray-100 text-gray-700 font-medium">
            <tr className="border-b">
              <th className="text-left px-4 py-2"></th>
              <th className="text-left px-4 py-2">Tên sản phẩm</th>
              <th className="text-left px-4 py-2">Loại danh mục</th>
              <th className="text-left px-4 py-2">Giá bán</th>
              <th className="text-left px-4 py-2">Màu</th>
              <th className="text-left px-4 py-2">Trạng thái</th>
              <th className="text-left px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              // nút mở rộng dòng để xem mô tả
              <React.Fragment key={p.MaSP}>
                <tr
                  data-id={p.MaSP}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => toggleExpand(p.MaSP)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      aria-label={
                        expanded[p.MaSP]
                          ? "Collapse description"
                          : "Expand description"
                      }
                    >
                      {expanded[p.MaSP] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  {/* tên sản phẩm với hình ảnh */}
                  <td className="px-4 py-2 text-gray-800 font-medium text-left">
                    <div className="flex items-center gap-3">
                      {(
                        p.HinhAnh && p.HinhAnh.length > 0
                          ? p.HinhAnh[0]
                          : p.HinhAnh
                      ) ? (
                        <Image
                          src={
                            p.HinhAnh?.[0]
                              ? p.HinhAnh[0].toString().startsWith("//")
                                ? `https:${p.HinhAnh[0]}`
                                : p.HinhAnh[0].toString()
                              : " "
                          }
                          alt={p.TenSP}
                          width={48}
                          height={48}
                          className="object-cover rounded-md bg-white border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">
                          No
                        </div>
                      )}
                      <div
                        className="whitespace-normal break-words"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.TenSP}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-gray-600 text-left">
                    {loaiMap[p.DANHMUC.Loai as keyof typeof loaiMap] ?? "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-800 text-left">
                    {typeof p.GiaBan === "number"
                      ? new Intl.NumberFormat("vi-VN").format(p.GiaBan) + " đ"
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-left">{p.MauSac ?? "-"}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        p.TrangThai === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {p.TrangThai === "ACTIVE"
                        ? "Đang hoạt động"
                        : "Ngừng hoạt động"}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => onView(p.MaSP)}
                    >
                      <Eye className="w-4 h-4" />
                      Xem
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => onEdit?.(p.MaSP)}
                    >
                      <SquarePen className="w-4 h-4" />
                      Chỉnh sửa
                    </Button>
                  </td>
                </tr>
                {/* mô tả sản phẩm khi dòng được mở rộng */}
                {expanded[p.MaSP] && (
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="px-4 py-2 text-sm text-gray-700">
                      <div className="font-medium mr-2">Tên sản phẩm:</div>
                      <div className="whitespace-pre-wrap inline">
                        {p.TenSP}
                      </div>
                      <div className="font-medium mr-2">Mô tả:</div>
                      <div className="whitespace-pre-wrap inline">{p.MoTa}</div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
