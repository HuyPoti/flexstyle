import React from "react";
import type { VaiTro } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface EditVaiTroPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: VaiTro) => void;
  roleNv?: VaiTro;
}

export default function EditVaiTroPopup({
  open,
  onClose,
  onSave,
  roleNv,
}: EditVaiTroPopupProps) {
  const [role, setRole] = React.useState<VaiTro | "">(roleNv || "");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[95vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Nâng cấp tài khoản</h2>
          <button
            className="text-gray-500 hover:text-red-500 text-xl"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        <Select
          value={role ?? roleNv}
          onValueChange={(val) => setRole(val as VaiTro)}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Chọn vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Chọn vai trò</SelectLabel>
              <SelectItem value="QLDN">Quản lý doanh nghiệp</SelectItem>
              <SelectItem value="NVVH">Nhân viên vận hành</SelectItem>
              <SelectItem value="NVCSKH">
                Nhân viên chăm sóc khách hàng
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => {
              if (role) {
                onSave(role);
              }
            }}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
