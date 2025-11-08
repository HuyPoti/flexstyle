"use client";

import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category } from "@/lib/types";

interface CategoriesTableProps {
  categories: Category[];
  onEdit?: (id: string) => void;
}

export default function CategoriesTable({
  categories,
  onEdit,
}: CategoriesTableProps) {
  return (
    <div className="mt-6 bg-gray-50 rounded-xl border p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Danh sách danh mục
        </h2>
        <p className="text-sm text-gray-500">Quản lý các danh mục sản phẩm</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-t border-gray-200 table-fixed">
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead className="bg-gray-100 text-gray-700 font-medium">
            <tr className="border-b">
              <th className="text-left px-4 py-2">Tên DM</th>
              <th className="text-left px-4 py-2">Loại DM</th>
              <th className="text-left px-4 py-2">Trạng thái</th>
              <th className="text-left px-4 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, idx) => (
              <tr
                key={c.MaDM ?? idx}
                data-id={c.MaDM}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 text-gray-800 font-medium text-left">
                  {c.TenDM}
                </td>
                <td className="px-4 py-2 text-gray-600 text-left">
                  {c.Loai ?? "-"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      c.TrangThai
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {c.TrangThai ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => onEdit?.(c.MaDM)}
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </Button>
                  {/* <Button size="sm" variant="outline" className="flex items-center gap-1 hover:bg-red-100 hover:text-red-600" onClick={() => onDelete?.(c.id)}>
										<Trash2 className="w-4 h-4" />
										Xóa
									</Button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
