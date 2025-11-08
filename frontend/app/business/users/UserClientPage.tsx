"use client";

import { useEffect, useState } from "react";
import UserTable from "@/components/business/UserTable";
import UsersModel from "@/interfaces/users";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Search, Funnel } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function UserClientPage({
  users: initial,
  access_token,
}: {
  users: UsersModel[];
  access_token: string;
}) {
  // map backend UsersModel (TAIKHOAN) to UI-friendly shape expected by UserTable
  const mapUser = (u: UsersModel) => ({
    id: u.MaTK,
    name: u.DisplayName ?? u.Username ?? u.Email ?? u.MaTK,
    email: u.Email,
    phone: undefined as string | undefined,
    address: undefined as string | undefined,
    status: (u.Status ?? u.Status) === "ACTIVE" ? ("active" as const) : ("inactive" as const),
  });

  const [users, setUsers] = useState((initial ?? []).map(mapUser));
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  useEffect(() => {
    setUsers((initial ?? []).map(mapUser));
  }, [initial]);

  const handleStatusChange = async (id: string, status: "active" | "inactive") => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    try {
      // Only call the taikhoan status endpoint. Backend enforces roles server-side.
      const desiredStatus = status === "active" ? "ACTIVE" : "INACTIVE";
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/taikhoan/status/${encodeURIComponent(id)}`;
      const res = await axios.patch(url, { status: desiredStatus }, { headers: { Authorization: `Bearer ${access_token}` } });
      if (!(res.status >= 200 && res.status < 300)) {
        throw new Error('Failed to update status');
      }
    } catch (e) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)));
      toast.error('Không thể cập nhật trạng thái — vui lòng thử lại' + e);
    }
  };

  // search/filter
  const normalize = (s?: string) => (s ?? "").toString().replace(/\s+/g, " ").trim().toLowerCase();
  const filtered = users.filter((u) => {
    if (!query) return true;
    const q = normalize(query);
    return (
      normalize(u.id)?.includes(q) ||
      normalize(u.name)?.includes(q) ||
      normalize(u.email)?.includes(q) ||
      normalize(u.phone)?.includes(q) ||
      normalize(u.address)?.includes(q)
    );
  });

  const filteredByStatus = filtered.filter((u) => {
    if (statusFilter === "all") return true;
    return u.status === statusFilter;
  });

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm người dùng..."
            className="pl-10 bg-muted border-0 w-full"
            value={query}
            onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
          />
        </div>

        <div className="w-44">
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as "all" | "active" | "inactive")}
          >
            <SelectTrigger className="w-44 relative pl-9 border-gray-200">
              <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Còn hoạt động</SelectItem>
              <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <section>
        <UserTable users={filteredByStatus} onStatusChange={(id, s) => handleStatusChange(id, s)} />
      </section>
    </div>
  );
}
