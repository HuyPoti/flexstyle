"use client";
import React, { useState } from "react";
import type { TrangThai } from "@/lib/types";
import { NhanVien } from "@/lib/types";
import { VaiTro } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface EditAccountPopupProps {
  open: boolean;
  onClose: () => void;
  account: NhanVien | null;
  onSave: (data: NhanVien) => void;
}

export default function EditAccountPopup({
  open,
  onClose,
  account,
  onSave,
}: EditAccountPopupProps) {
  const [displayName, setDisplayName] = useState(account?.DisplayName ?? "");
  const [email, setEmail] = useState(account?.Email ?? "");
  const [avatar, setAvatar] = useState(account?.Avatar ?? "");
  const [status, setStatus] = useState<TrangThai>(account?.Status ?? "ACTIVE");
  const [role, setRole] = useState<VaiTro>(account?.VAITRO ?? "QLDN");

  // Reset form when account changes
  React.useEffect(() => {
    setDisplayName(account?.DisplayName ?? "");
    setEmail(account?.Email ?? "");
    setAvatar(account?.Avatar ?? "");
    setStatus(account?.Status ?? "ACTIVE");
  }, [account]);

  if (!open || !account) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[95vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chỉnh sửa tài khoản</h2>
          <button
            className="text-gray-500 hover:text-red-500 text-xl"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              ...account,
              DisplayName: displayName,
              Email: email,
              Avatar: avatar,
              Status: status,
              VAITRO: role,
            });
            onClose();
          }}
          className="space-y-3"
        >
          <div>
            <label className="block text-sm font-medium">Tên hiển thị</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={displayName ?? ""}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={email ?? ""}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Avatar (URL)</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={avatar ?? ""}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>
          <div>
            <div className="relative">
              <label className="block text-sm font-medium mb-1">
                Trạng thái
              </label>
              <Select
                value={status ?? account.Status}
                onValueChange={(val) => setStatus(val as TrangThai)}
              >
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Chọn trạng thái</SelectLabel>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Vai trò</label>
              <Select
                value={role ?? account.VAITRO}
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
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
