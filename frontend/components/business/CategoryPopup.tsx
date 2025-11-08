"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";
import { Category } from "@/lib/types";

interface CategoryPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Category) => void;
  initialData?: Category | null;
}

export default function CategoryPopup({
  open,
  onClose,
  onSave,
  initialData,
}: CategoryPopupProps) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("Áo");
  const [active, setActive] = useState<string>("ACTIVE");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Khi mở popup hoặc dữ liệu ban đầu thay đổi, cập nhật trạng thái
  useEffect(() => {
    if (open && initialData) {
      setId(initialData.MaDM ?? "");
      setName(initialData.TenDM ?? "");
      setType(initialData.Loai ?? "Áo");
      setActive(initialData.TrangThai);
      setErrors({});
    } else if (!open) {
      setId("");
      setName("");
      setType("Áo");
      setActive("ACTIVE");
      setErrors({});
    }
  }, [open, initialData]);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name || !name.trim()) e.name = "Tên danh mục không được để trống";
    if (!type || !type.trim()) e.type = "Vui lòng chọn loại";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // tạo id ngẫu nhiên nếu không có id
  // const genId = () => {
  //   try {
  //     // @ts-ignore
  //     if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') return (crypto as any).randomUUID();
  //   } catch (e) {
  //     // ignore
  //   }
  //   return `cat_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  // };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm / Chỉnh sửa danh mục</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-sm text-gray-700 mb-1 block">
              Tên danh mục
            </label>
            <Input
              className={
                errors.name ? "border-red-300 focus:border-red-500" : ""
              }
              placeholder="Nhập tên danh mục"
              value={name}
              onChange={(e) => {
                setName((e.target as HTMLInputElement).value);
                if (errors.name) {
                  setErrors((prev) => {
                    const c = { ...prev };
                    delete c.name;
                    return c;
                  });
                }
              }}
            />
            {errors.name && (
              <div className="text-xs text-red-600 mt-1">{errors.name}</div>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-1 block">Loại</label>
            <Select
              value={type}
              onValueChange={(v) => {
                setType(v);
                if (errors.type) {
                  setErrors((prev) => {
                    const c = { ...prev };
                    delete c.type;
                    return c;
                  });
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn loại danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AO">Áo</SelectItem>
                <SelectItem value="QUAN">Quần</SelectItem>
                <SelectItem value="PHU_KIEN">Phụ kiện</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <div className="text-xs text-red-600 mt-1">{errors.type}</div>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">
              Trạng thái
            </label>
            <Select value={active} onValueChange={(v) => setActive(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="hover:bg-red-500 flex items-center gap-2"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
            Hủy
          </Button>
          <Button
            className="bg-[#8B5CF6] text-white flex items-center gap-2"
            onClick={() => {
              if (!validate()) return;
              const finalId = id && id.trim() ? id : "";
              onSave({
                MaDM: finalId,
                TenDM: name,
                Loai: type,
                TrangThai: active,
              });
            }}
          >
            <Save className="w-4 h-4" />
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
