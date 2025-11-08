"use client";
import { useState } from "react";
import { Edit, Search } from "lucide-react";
// import { Button } from "../ui/button";
import EditAccountPopup from "./EditAccountPopup";
import { NhanVien, VaiTro } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import axios from "axios";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditVaiTroPopup from "./EditVaiTroPopup";
import Image from "next/image";

interface AccountListPopupProps {
  open: boolean;
  onClose: () => void;
  accounts: NhanVien[];
  role: string;
}

export default function AccountListPopup({
  open,
  onClose,
  accounts,
  role,
}: AccountListPopupProps) {
  const supabase = createClient();
  const [editOpen, setEditOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<NhanVien | null>(null);
  const [giatri, setGiatri] = useState<string>("");
  const handleSave = async (data: NhanVien) => {
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ql/${data.MaTK}`,
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
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };
  const handleSaveRole = async (data: VaiTro) => {
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/nv/role/${selectedAccount?.MaTK}`,
        {
          vaiTro: data,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("Cập nhật vai trò thành công! Vui lòng tải lại trang");
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };
  const handleClick = (acc: NhanVien) => {
    if (role === "QLDN") {
      setSelectedAccount(acc);
      setEditOpen(true);
    } else {
      setSelectedAccount(acc);
      setRoleOpen(true);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40">
      <EditAccountPopup
        open={editOpen && role === "QLDN"}
        onClose={() => setEditOpen(false)}
        account={selectedAccount}
        onSave={handleSave}
      />

      <EditVaiTroPopup
        open={roleOpen && role !== "QLDN"}
        onClose={() => setRoleOpen(false)}
        onSave={handleSaveRole}
        roleNv={selectedAccount?.VAITRO}
      />

      <div className="flex min-w-[300px] max-w-[500px] mb-3">
        <div className="relative mr-3">
          {giatri === "TrangThai" ? (
            <Select
              value={
                searchQuery
                  ? searchQuery === "ACTIVE"
                    ? "ACTIVE"
                    : "INACTIVE"
                  : ""
              }
              onValueChange={(val) => setSearchQuery(val as string)}
            >
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Trạng thái</SelectLabel>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm..."
                className="pl-10 bg-muted border-0"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </>
          )}
        </div>
        <Select
          value={giatri ?? "DisplayName"}
          onValueChange={(val) => {
            setGiatri(val as string);
            setSearchQuery("");
          }}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Chọn tiêu chí" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="DisplayName">Tên hiển thị</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="TrangThai">Trạng thái</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px] max-h-[90vh] overflow-y-auto max-w-[95vw]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Danh sách tài khoản</h2>
          <button
            className="text-gray-500 hover:text-red-500 text-xl"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Tên hiển thị</th>
                <th className="px-2 py-1 text-left">Email</th>
                <th className="px-2 py-1 text-left">Avatar</th>
                <th className="px-2 py-1 text-left">Vai trò</th>
                <th className="px-2 py-1 text-left">Trạng thái</th>
                <th className="px-2 py-1 text-left">Tạo lúc</th>
                <th className="px-2 py-1 text-left">Cập nhật</th>
                <th className="px-2 py-1 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {accounts
                .filter((acc) => {
                  if (!searchQuery) return true;
                  const field = giatri || "DisplayName";

                  if (field === "TrangThai") {
                    return acc.Status.toLowerCase().includes(
                      searchQuery.toLowerCase()
                    );
                  }
                  const value = (
                    acc[field as keyof NhanVien] as string | undefined
                  )?.toLowerCase();
                  return value?.includes(searchQuery.toLowerCase());
                })
                .map((acc) => (
                  <tr key={acc.MaTK}>
                    <td className="px-2 py-1">{acc.DisplayName ?? "-"}</td>
                    <td className="px-2 py-1">{acc.Email ?? "-"}</td>
                    <td className="px-2 py-1 flex items-center justify-center">
                      {acc.Avatar ? (
                        <Image
                          src={acc.Avatar}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="bg-blue-400 text-white rounded-full h-8 w-8 flex items-center justify-center">
                          {acc.DisplayName?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-1">{acc.VAITRO}</td>
                    <td className="px-2 py-1">
                      <span
                        className={
                          acc.Status === "ACTIVE"
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {acc.Status}
                      </span>
                    </td>
                    <td className="px-2 py-1">
                      {new Date(acc.created_at).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-2 py-1">
                      {new Date(acc.updated_at).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-2 py-1 flex items-center justify-center">
                      <button
                        className="text-blue-600 hover:underline  w-6 h-6 flex items-center justify-center"
                        onClick={() => handleClick(acc)}
                      >
                        <Edit className="inline-block w-4 h-4 mr-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              {accounts.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-400">
                    Không có tài khoản nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* {role === "QLDN" && (
            <Button className="mt-3">
              <Plus className="h-4 w-4 mr-2" />
              Thêm chức vụ
            </Button>
          )} */}
      </div>
    </div>
  );
}
