"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter as FilterIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import CategoriesTable from "@/components/business/CategoriesTable";
import CategoryPopup from "@/components/business/CategoryPopup";
import { Category } from "@/lib/types";
import { toast } from "react-toastify";

export default function CategoriesPage({
  fetchCategories,
  accessToken,
}: {
  fetchCategories: Category[];
  accessToken: string;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Category[]>([]);

  // Lọc danh mục dựa trên từ khóa tìm kiếm
  const [typeFilter, setTypeFilter] = useState<
    "all" | "AO" | "QUAN" | "PHU_KIEN"
  >("all");

  useEffect(() => {
    setCategories(fetchCategories);
  }, [fetchCategories]);

  useEffect(() => {
    setFiltered(
      Array.isArray(categories)
        ? categories.filter((c) => {
            // Lọc theo tìm kiếm chung
            if (query) {
              const q = query.toLowerCase();
              if (
                !(
                  (c.TenDM ?? "").toLowerCase().includes(q) ||
                  (c.Loai ?? "").toLowerCase().includes(q) ||
                  (c.TrangThai ?? "").toLowerCase().includes(q)
                )
              ) {
                return false;
              }
            }
            // Lọc theo tìm kiếm loại
            if (typeFilter !== "all") {
              return c.Loai === typeFilter;
            }
            return true;
          })
        : []
    );
  }, [categories, query, typeFilter]);

  // Kiểm tra thông tin trùng lặp trước khi lưu
  const handleSave = async (data: Category) => {
    const normalize = (s?: string) =>
      (s ?? "").toString().replace(/\s+/g, " ").trim();
    const normName = normalize(data.TenDM);
    const normType = normalize(data.Loai) || "AO";

    if (!normName || !normType) {
      toast.error("Vui lòng điền đầy đủ Mã, Tên và Loại danh mục.");
      return;
    }

    // Chuẩn hóa dữ liệu trước khi lưu
    data.TenDM = normName;
    data.Loai = normType;

    const duplicates: string[] = [];
    for (const c of categories) {
      if (editing && c.MaDM === editing.MaDM) continue;
      if (normalize(c.TenDM) === normName) duplicates.push("Tên danh mục");
    }

    if (duplicates.length > 0) {
      toast.error(
        `Thông tin trùng: ${Array.from(new Set(duplicates)).join(", ")}`
      );
      return;
    }
    if (editing) {
      console.log("updating", data);
      // Gọi API cập nhật danh mục
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/danhmuc/update/${editing.MaDM}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        toast.error("Cập nhật danh mục thất bại");
        return;
      }
      toast.success("Lưu danh mục thành công");
    } else {
      console.log("creating", data);
      console.log("accessToken", accessToken);
      // Gọi API tạo mới danh mục
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/danhmuc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          TenDM: data.TenDM,
          Loai: data.Loai,
          TrangThai: data.TrangThai,
        }),
      });
      if (res.status !== 201 && res.status !== 200) {
        toast.error("Tạo danh mục thất bại");
        return;
      }
      toast.success("Tạo danh mục thành công");
    }
    setCategories((prev) => {
      if (editing) {
        return prev.map((p) => (p.MaDM === editing.MaDM ? data : p));
      }
      return [data, ...prev];
    });

    setOpen(false);
    setEditing(null);
  };

  const handleEdit = (id: string) => {
    const c = categories.find((x) => x.MaDM === id);
    if (c) {
      setEditing(c);
      setOpen(true);
    }
  };

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 w-full max-w-2xl">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm..."
              className="pl-10 bg-muted border-0 w-full"
              value={query}
              onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
            />
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Thêm danh mục
          </Button>
        </div>

        <div className="flex items-center">
          <Select
            onValueChange={(v) =>
              setTypeFilter(v as "all" | "AO" | "QUAN" | "PHU_KIEN")
            }
            defaultValue="all"
          >
            <SelectTrigger className="w-48 relative pl-9 border-gray-200">
              <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <SelectValue placeholder="Tất cả loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="AO">Áo</SelectItem>
              <SelectItem value="QUAN">Quần</SelectItem>
              <SelectItem value="PHU_KIEN">Phụ kiện</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-6">
        <CategoriesTable categories={filtered} onEdit={handleEdit} />
      </div>

      <CategoryPopup
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initialData={editing ?? undefined}
      />
    </main>
  );
}
