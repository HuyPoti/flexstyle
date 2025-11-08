"use client";

import React from "react";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import StaffMember from "@/interfaces/staffMember";

interface StaffTableProps {
  staff: StaffMember[];
  onEdit?: (s: StaffMember) => void;
}
const columns = {
  displayName: "Tên tài khoản",
  role: "Chức vụ",
  email: "Email",
  username: "Username",
  status: "Trạng thái",
  actions: "Thao tác",
};
export default function StaffTable({ staff, onEdit }: StaffTableProps) {
  return (
    <div className="mt-6 bg-gray-50 rounded-xl border p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Danh sách nhân viên
        </h2>
        <p className="text-sm text-gray-500">Quản lý thông tin nhân viên</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-t border-gray-200 table-fixed text-center">
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "7%" }} />
          </colgroup>
          <thead className="bg-gray-100 text-gray-700 font-medium">
            <tr className="border-b">
              {Object.values(columns).map((colName) => (
                <th key={colName} className="px-4 py-3">
                  {colName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr
                key={s.MaTK}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-800 font-medium">
                  {s.DisplayName ?? "-"}
                </td>
                <td className="px-4 py-3 text-gray-600">{s.VAITRO ?? "-"}</td>
                <td className="px-4 py-3 text-gray-600 truncate">
                  {s.Email ?? "-"}
                </td>
                <td className="px-4 py-3 text-gray-600">{s.Username ?? "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      s.Status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.Status === "ACTIVE"
                      ? "Còn hoạt động"
                      : "Ngừng hoạt động"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => onEdit?.(s)}
                  >
                    <SquarePen className="w-4 h-4" />
                    Chỉnh sửa
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
