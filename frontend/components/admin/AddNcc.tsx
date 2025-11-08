"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { createClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectLabel,
} from "../ui/select";

type TrangThai = "ACTIVE" | "INACTIVE";

interface AddSupplierProps {
  open: boolean;
  onClose: () => void;
}

export default function AddSupplierPopup({ open, onClose }: AddSupplierProps) {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  //   const [phone, setPhone] = useState<string>("");
  //   const [address, setAddress] = useState("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [status, setStatus] = useState<TrangThai>("ACTIVE");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setUsername("");
      setDisplayName("");
      setEmail("");
      //   setPhone("");
      //   setAddress("");
      setPassword("");
      setConfirm("");
      setStatus("ACTIVE");
      setAvatar(null);
      setError(null);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const validate = () => {
    // if (!username.trim()) return "Username is required";
    if (!displayName.trim()) return "Tên nhà cung cấp là bắt buộc";
    if (!email.trim()) return "Email is required";
    if (!password) return "Mật khẩu là bắt buộc";
    if (password !== confirm) return "Mật khẩu xác nhận không khớp";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("Không có phiên đăng nhập. Vui lòng đăng nhập.");
        setLoading(false);
        return;
      }
      const accessToken = session.access_token;

      const normalizedEmail = (email ?? "").trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        setError("Email không hợp lệ");
        return;
      }
      if (!username.trim()) {
        setError("Username bắt buộc");
        return;
      }
      if (!displayName.trim()) {
        setError("Tên nhà cung cấp bắt buộc");
        return;
      }
      if (!password || password !== confirm) {
        setError("Mật khẩu không hợp lệ hoặc không khớp");
        return;
      }

      const payload = {
        Username: username.trim(),
        DisplayName: displayName.trim(),
        Email: normalizedEmail,
        MatKhau: password,
        VAITRO: "NCC",
        Status: status,
        Avatar: avatar,
        // Phone: phone?.trim(),
        // Address: address?.trim(),
      };
      console.log("Create supplier payload:", payload);
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ncc/dangky`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      alert("Tạo nhà cung cấp thành công");
      onClose();
      router.refresh();
    } catch {
      setError("Tạo thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Thêm nhà cung cấp</h3>
          <button className="text-xl" onClick={onClose} aria-label="Đóng">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">
                Tên nhà cung cấp
              </label>
              <input
                className="border rounded px-2 py-2 w-full"
                placeholder="Nhập tên nhà cung cấp"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Nhập Username</label>
              <input
                className="border rounded px-2 py-2 w-full"
                placeholder="SheYu"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {/* <div>
              <label className="block text-sm font-medium">Số điện thoại</label>
              <input
                className="border rounded px-2 py-2 w-full"
                placeholder="0123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div> */}
          </div>

          <div>
            <label className="block text-sm font-medium">Nhập email</label>
            <input
              type="email"
              className="border rounded px-2 py-2 w-full"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium">
              Nhập địa chỉ nhà cung cấp
            </label>
            <input
              className="border rounded px-2 py-2 w-full"
              placeholder="Nhập địa chỉ nhà cung cấp"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div> */}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Nhập mật khẩu</label>
              <input
                type="password"
                className="border rounded px-2 py-2 w-full"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                className="border rounded px-2 py-2 w-full"
                placeholder="Nhập lại mật khẩu"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Trạng thái
              </label>
              <Select>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Trạng thái</SelectLabel>
                    <SelectItem
                      value="ACTIVE"
                      onSelect={() => setStatus("ACTIVE")}
                    >
                      ACTIVE
                    </SelectItem>
                    <SelectItem
                      value="INACTIVE"
                      onSelect={() => setStatus("INACTIVE")}
                    >
                      INACTIVE
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded border bg-white"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-3 py-2 rounded bg-purple-600 text-white"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
