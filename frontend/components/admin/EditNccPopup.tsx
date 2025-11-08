"use client";
import React, { useState } from "react";
import type { TrangThai } from "@/lib/types";
import { NhanVien } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { createClient } from "@/lib/supabase/client";
interface EditAccountPopupProps {
  open: boolean;
  onClose: () => void;
  account: NhanVien | null;
}

export default function EditNccPopup({
  open,
  onClose,
  account,
}: EditAccountPopupProps) {
  const supabase = createClient();
  const [displayName, setDisplayName] = useState(account?.DisplayName ?? "");
  const [email, setEmail] = useState(account?.Email ?? "");
  const [avatar, setAvatar] = useState(account?.Avatar ?? "");
  const [status, setStatus] = useState<TrangThai>(account?.Status ?? "ACTIVE");
  const handleEditSave = async (data: NhanVien) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      console.log("No active session found.");
      return;
    }

    const accessToken = session.access_token;

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ncc/${data.MaTK}`,
        {
          DisplayName: data.DisplayName,
          Email: data.Email,
          Status: data.Status,
          Avatar: data.Avatar,
          MaTK: data.MaTK,
          VAITRO: data.VAITRO,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("Cập nhật tài khoản thành công! Vui lòng tải lại trang");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating account:", error.response?.data);
        alert(
          "Cập nhật tài khoản thất bại: " + JSON.stringify(error.response?.data)
        );
      } else {
        console.error("Error updating account:", error);
        alert("Cập nhật tài khoản thất bại. Vui lòng thử lại.");
      }
    }
  };

  // Reset form when account changes
  React.useEffect(() => {
    setDisplayName(account?.DisplayName ?? "");
    setEmail(account?.Email ?? "");
    setAvatar(account?.Avatar ?? "");
    setStatus(account?.Status ?? "ACTIVE");
  }, [account]);

  if (!open || !account) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[95vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chỉnh sửa tài khoản</h2>
          {/* <button
            className="text-gray-500 hover:text-red-500 text-xl"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button> */}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditSave({
              ...account,
              DisplayName: displayName,
              Email: email,
              Avatar: avatar,
              Status: status,
            });
            onClose();
          }}
          className="space"
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
              className="px-3 py-1 bg-primary rounded text-white hover:bg-primary/90"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
