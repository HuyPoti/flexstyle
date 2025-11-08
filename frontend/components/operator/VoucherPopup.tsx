"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Voucher } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface VoucherPopupProps {
  open: boolean;
  voucher: Voucher | null;
  onClose: () => void;
  onSave: (data: Voucher) => void;
}

export default function VoucherPopup({
  open,
  voucher,
  onClose,
  onSave,
}: VoucherPopupProps) {
  const [form, setForm] = useState<Voucher>({
    MaVoucher: "",
    TenVoucher: "",
    Code: "",
    Dieukien: 0,
    SoTien: 0,
    Loai: "GiamGia",
    NgayBatDau: new Date(Date.now() + 24 * 60 * 60 * 1000),
    NgayKetThuc: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    MoTa: "",
    TrangThai: "ACTIVE",
    SoLuong: 100,
  } as Voucher);

  useEffect(() => {
    if (voucher) {
      setForm(voucher);
    }
  }, [voucher]);

  const handleChange = (field: keyof Voucher, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value } as Voucher));
  };

  const formatDateForInput = (v?: Date | string) => {
    if (!v) return "";
    const d = new Date(v);
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  const isStartDatePastOrNow = (date?: Date | string) => {
    if (!date) return false;
    const start = new Date(date).getTime();
    if (isNaN(start)) return false;
    const now = Date.now();
    return start < now;
  };

  const handleSubmit = async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    let response = null;
    console.log("form:", form);
    if (form.MaVoucher != "") {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/voucher/update/${form.MaVoucher}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.session?.access_token}`,
          },
          body: JSON.stringify({
            MoTa: form.MoTa,
            NgayBatDau: `${new Date(form.NgayBatDau!).toISOString()}`,
            NgayKetThuc: `${new Date(form.NgayKetThuc!).toISOString()}`,
            TenVoucher: form.TenVoucher,
            TrangThai: form.TrangThai,
            Dieukien: Number(form.Dieukien),
            Loai: form.Loai,
            Code: form.Code,
            SoTien: Number(form.SoTien),
            SoLuong: Number(form.SoLuong),
          }),
        }
      );
    } else {
      response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/voucher/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.session?.access_token}`,
        },
        body: JSON.stringify({
          MoTa: form.MoTa,
          NgayBatDau: `${new Date(form.NgayBatDau!).toISOString()}`,
          NgayKetThuc: `${new Date(form.NgayKetThuc!).toISOString()}`,
          TenVoucher: form.TenVoucher,
          TrangThai: form.TrangThai,
          Dieukien: Number(form.Dieukien),
          Loai: form.Loai,
          Code: form.Code,
          SoTien: Number(form.SoTien),
          SoLuong: Number(form.SoLuong),
        }),
      });
    }
    if (response.status === 200 || response.status === 201) {
      onSave(form);
    } else {
      alert("Lưu không thành công!");
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {form?.MaVoucher ? "Chỉnh sửa Voucher" : "Tạo Voucher"}
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label className="text-sm">Tên voucher</Label>
            <Input
              value={form.TenVoucher}
              onChange={(e) => handleChange("TenVoucher", e.target.value)}
              placeholder="Tên voucher"
              disabled={
                form.MaVoucher ? isStartDatePastOrNow(form.NgayKetThuc) : false
              }
            />
          </div>
          <div>
            <Label className="text-sm">Loại voucher</Label>
            <Select
              value={form.Loai}
              disabled={
                form.MaVoucher ? isStartDatePastOrNow(form.NgayKetThuc) : false
              }
            >
              {form.MaVoucher ? isStartDatePastOrNow(form.NgayKetThuc) : false}
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Loại VOUCHER" />
              </SelectTrigger>
              <SelectContent>
                {" "}
                <SelectItem value="FreeShip">Free ship</SelectItem>
                <SelectItem value="GiamGia">Giảm giá</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div hidden={form.Loai !== "GiamGia"}>
            <Label className="text-sm">Nhập điều kiện ({" > "} giá trị)</Label>
            <Input
              value={form.Dieukien}
              onChange={(e) => handleChange("Dieukien", e.target.value)}
              placeholder="Điều kiện áp dụng"
              type="number"
              min={0}
              step={1000}
              disabled={
                form.MaVoucher ? isStartDatePastOrNow(form.NgayKetThuc) : false
              }
            />
          </div>

          <div hidden={form.Loai !== "GiamGia"}>
            <Label className="text-sm">Giá tiền</Label>
            <Input
              value={form.SoTien}
              onChange={(e) => handleChange("SoTien", e.target.value)}
              placeholder="Số tiền giảm"
              type="number"
              min={0}
              step={1000}
              disabled={
                form.MaVoucher ? isStartDatePastOrNow(form.NgayKetThuc) : false
              }
            />
          </div>

          <div>
            <Label className="text-sm">Ngày bắt đầu</Label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                type="datetime-local"
                className="pl-8"
                value={formatDateForInput(form.NgayBatDau)}
                onChange={(e) => handleChange("NgayBatDau", e.target.value)}
                disabled={
                  form.MaVoucher ? isStartDatePastOrNow(form.NgayBatDau) : false
                }
              />
            </div>
          </div>

          <div>
            <Label className="text-sm">Ngày kết thúc</Label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                type="datetime-local"
                className="pl-8"
                value={formatDateForInput(form.NgayKetThuc)}
                onChange={(e) => handleChange("NgayKetThuc", e.target.value)}
                disabled={
                  form.MaVoucher
                    ? isStartDatePastOrNow(form.NgayKetThuc)
                    : false
                }
              />
            </div>
          </div>
          <div>
            <Label className="text-sm">Số lượng</Label>
            <Input
              value={form.SoLuong}
              onChange={(e) => handleChange("SoLuong", e.target.value)}
              placeholder="Số lượng voucher"
              type="number"
              min={0}
              step={1}
              disabled={
                form.MaVoucher ? isStartDatePastOrNow(form.NgayKetThuc) : false
              }
            />
          </div>
        </div>
        <div>
          <Label className="text-sm">Mô tả</Label>
          <Input
            value={form.MoTa}
            onChange={(e) => handleChange("MoTa", e.target.value)}
            placeholder="Mô tả voucher"
            disabled={
              form.MaVoucher ? isStartDatePastOrNow(form.NgayKetThuc) : false
            }
          />
        </div>
        <div>
          <Label className="text-sm">Mã Code</Label>
          <Input
            value={form.Code}
            onChange={(e) => handleChange("Code", e.target.value)}
            placeholder="Mã voucher"
            disabled={
              form.MaVoucher ? isStartDatePastOrNow(form.NgayKetThuc) : false
            }
          />
        </div>
        {/* Footer */}
        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Select
            value={form.TrangThai}
            onValueChange={(value) => handleChange("TrangThai", value)}
            disabled={
              form.MaVoucher ? isStartDatePastOrNow(form.NgayKetThuc) : false
            }
          >
            <SelectTrigger
              className={`flex-1 ${
                form.TrangThai === "ACTIVE"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="text-green-500" value="ACTIVE">
                Còn hoạt động
              </SelectItem>
              <SelectItem className="text-red-500" value="INACTIVE">
                Tạm dừng
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-purple-500 hover:bg-purple-600 text-white"
            onClick={handleSubmit}
            disabled={
              form.MaVoucher ? isStartDatePastOrNow(form.NgayKetThuc) : false
            }
          >
            💾 Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
