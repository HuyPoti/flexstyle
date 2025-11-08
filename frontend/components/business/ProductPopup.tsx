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
import { useState, useEffect, useContext } from "react";
import { Save, X } from "lucide-react";
import Product from "@/interfaces/product";
import ProductDetail from "@/interfaces/productDetail";
import Image from "next/image";

interface ProductPopupProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Product) => void;
  initialData?: Product;
  selectedSizeIndex: number;
  setSelectedSizeIndex: (index: number) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export default function ProductPopup({
  open,
  onClose,
  onSave,
  initialData,
  selectedSizeIndex,
  setSelectedSizeIndex,
  // error,
  // setError,
}: ProductPopupProps) {
  const [form, setForm] = useState<Product>(
    initialData ?? {
      MaSP: "",
      TenSP: "",
      DANHMUC: { MaDM: "", TenDM: "", MoTa: "", Loai: "" },
      GiaBan: 0,
      MauSac: "",
      TrangThai: "ACTIVE",
      CHITIETSANPHAM: [],
      MoTa: "",
      HinhAnh: [],
      slug: "",
      MaDM: "",
    }
  );

  const [previews, setPreviews] = useState<(string | File)[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const { categories, loading } = useContext(CategoryContext);
  const [loadingImage, setLoading] = useState(false);
  // Reset form when popup opens or closes
  useEffect(() => {
    if (open && initialData) {
      setForm({
        MaSP: initialData.MaSP ?? "",
        TenSP: initialData.TenSP ?? "",
        DANHMUC: initialData.DANHMUC ?? {
          MaDM: "",
          TenDM: "",
          MoTa: "",
          Loai: "",
        },
        GiaBan: initialData.GiaBan ?? 0,
        MauSac: initialData.MauSac ?? "",
        TrangThai: initialData.TrangThai ?? "ACTIVE",
        CHITIETSANPHAM: initialData.CHITIETSANPHAM ?? [],
        MoTa: initialData.MoTa ?? "",
        HinhAnh: initialData.HinhAnh ?? [],
        slug: initialData.slug,
        MaDM: initialData.MaDM,
      });
      setPreviews(initialData.HinhAnh ?? []);
      setSelectedSizeIndex(0);
    } else if (!open) {
      setForm({
        MaSP: "",
        TenSP: "",
        DANHMUC: { MaDM: "", TenDM: "", MoTa: "", Loai: "" },
        GiaBan: 0,
        MauSac: "",
        TrangThai: "ACTIVE",
        CHITIETSANPHAM: [],
        MoTa: "",
        HinhAnh: [],
        slug: "",
        MaDM: "",
      });
      setPreviews([]);
      setErrors({});
      setSelectedSizeIndex(0);
    }
  }, [open, initialData, setSelectedSizeIndex]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const arr = Array.from(files);
    if (arr.length + previews.length > 10) {
      return setErrors({ image: "Tối đa 10 ảnh" });
    }
    setForm((f) => ({
      ...f!,
      HinhAnh: [...(f?.HinhAnh || []), ...arr],
    }));

    // Show previews
    setLoading(true);
    const readers = arr.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers)
      .then((urls) => setPreviews((p) => [...p, ...urls]))
      .finally(() => setLoading(false));
  };

  const removeImageAt = (i: number) => {
    setForm((f) => ({
      ...f!,
      HinhAnh: (f?.HinhAnh || []).filter((_, j) => j !== i),
    }));
    setPreviews((p) => p.filter((_, j) => j !== i));
  };

  const setDetailField = (
    index: number,
    field: keyof ProductDetail,
    value: unknown
  ) => {
    setForm((prev) => {
      const details = [...prev.CHITIETSANPHAM];
      details[index] = { ...details[index], [field]: value };
      return { ...prev, CHITIETSANPHAM: details };
    });
  };

  const setField = (field: keyof Product, value: unknown) => {
    setForm((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.TenSP.trim()) e.name = "Tên không được trống";
    if (!form.DANHMUC.TenDM.trim()) e.category = "Chọn danh mục";
    if (!form.GiaBan || Number(form.GiaBan) <= 0) e.price = "Giá phải > 0";
    if (!form.MauSac.trim()) e.color = "Nhập màu sắc";
    if (previews.length === 0) e.image = "Chọn ít nhất 1 ảnh";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      if (onSave) {
        await onSave(form);
      }
      onClose();
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[1100px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Basic fields */}
          <div>
            <label>Tên sản phẩm</label>
            <Input
              value={form.TenSP}
              onChange={(e) => setField("TenSP", e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label>Danh mục</label>
            <Select
              value={form.DANHMUC.TenDM}
              onValueChange={(v) => {
                // Find the selected category object
                const selectedCat = categories.find((cat) => cat.TenDM === v);
                if (selectedCat) {
                  setField("DANHMUC", {
                    TenDM: selectedCat.TenDM,
                    MaDM: selectedCat.MaDM,
                    MoTa: selectedCat.MoTa,
                    Loai: selectedCat.Loai,
                  });
                } else {
                  // fallback if not found
                  setField("DANHMUC", {
                    TenDM: v,
                    MaDM: "",
                    MoTa: "",
                    Loai: "",
                  });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {!loading &&
                  Array.isArray(categories) &&
                  categories.map((cat) => (
                    <SelectItem key={cat.MaDM} value={cat.TenDM}>
                      {cat.TenDM}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          <div>
            <label>Giá bán</label>
            <Input
              type="number"
              value={form.GiaBan}
              onChange={(e) => setField("GiaBan", Number(e.target.value))}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
          </div>

          <div>
            <label>Màu sắc</label>
            <Input
              value={form.MauSac}
              onChange={(e) => setField("MauSac", e.target.value)}
            />
            {errors.color && (
              <p className="text-red-500 text-sm">{errors.color}</p>
            )}
          </div>

          {/* Trạng thái */}
          <div>
            <label>Trạng thái</label>
            <Select
              value={form.TrangThai}
              onValueChange={(v) => setField("TrangThai", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <label>Chọn size</label>
            <Select
              value={sizes[selectedSizeIndex]}
              onValueChange={(v) => {
                const idx = sizes.findIndex((d) => d === v);
                setSelectedSizeIndex(idx !== -1 ? idx : 0);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((d, i) => (
                  <SelectItem key={i} value={sizes[i]}>
                    {sizes[i]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-2">
              <label>Số lượng cho size {sizes[selectedSizeIndex]}</label>
              <Input
                type="number"
                value={form.CHITIETSANPHAM[selectedSizeIndex]?.SoLuong || 0}
                onChange={(e) =>
                  setDetailField(
                    selectedSizeIndex,
                    "SoLuong",
                    Number(e.target.value)
                  )
                }
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="col-span-2">
            <label>Mô tả</label>
            <textarea
              className="w-full border rounded p-2"
              rows={4}
              value={form.MoTa}
              onChange={(e) => setField("MoTa", e.target.value)}
            />
          </div>

          {/* Hình ảnh */}
          <div className="col-span-2">
            <label>Hình ảnh (tối đa 10)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
            <div className="grid grid-cols-4 gap-2 mt-2">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <div className="relative w-full h-24">
                    <Image
                      src={
                        (src as string).startsWith("//")
                          ? "https:" + (src as string)
                          : (src as string)
                      }
                      alt="product"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded border"
                    />
                  </div>

                  <button
                    onClick={() => removeImageAt(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="justify-center mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-1" /> Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#8B5CF6] text-white "
            disabled={loadingImage}
          >
            <Save className="w-4 h-4 mr-1" /> Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
