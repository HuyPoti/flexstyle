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
import { SuKienUuDai } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface PromotionPopupProps {
  open: boolean;
  promo: SuKienUuDai | null;
  onClose: () => void;
  onSave: (data: SuKienUuDai) => void;
}

export default function PromotionPopupChange({
  open,
  promo,
  onClose,
  onSave,
}: PromotionPopupProps) {
  const [form, setForm] = useState<SuKienUuDai>({
    MaSK: "",
    TenSK: "",
    NgayPH: new Date(Date.now() + 24 * 60 * 60 * 1000),
    NgayKT: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    PhanTramGiam: 0,
    MoTa: "",
    TrangThai: "ACTIVE",
  });
  useEffect(() => {
    if (promo) {
      console.log("promo:", promo);
      setForm(promo);
    }
  }, [promo]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm({ ...form, [field]: value });
  };

  const formatDateForInput = (v: Date) => {
    const d = new Date(v);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hour = String(d.getHours()).padStart(2, "0");
    const minute = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };
  // Helper to check if NgayPH is in the past or now (timestamp comparison)
  const isStartDatePastOrNow = (date: Date) => {
    const now = Date.now();
    const start = new Date(date).getTime();
    return start < now;
  };

  const handleSubmit = async () => {
    // Ensure date fields are Date objects when saving
    const payload = {
      ...form,
      NgayPH: form.NgayPH,
      NgayKT: form.NgayKT,
    };
    console.log("Submitting form:", payload);
    const supabase = await createClient();
    const { data} = await supabase.auth.getSession();
    let response = null;
    if (payload.MaSK != "") {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sukienuudai/update/${payload.MaSK}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.session?.access_token}`,
          },
          body: JSON.stringify({
            MoTa: payload.MoTa,
            NgayPH: `${new Date(payload.NgayPH).toISOString()}`,
            NgayKT: `${new Date(payload.NgayKT).toISOString()}`,
            PhanTramGiam: Number(payload.PhanTramGiam),
            TrangThai: payload.TrangThai,
            TenSK: payload.TenSK,
          }),
        }
      );
    } else {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sukienuudai/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.session?.access_token}`,
          },
          body: JSON.stringify({
            MoTa: payload.MoTa,
            NgayPH: `${new Date(payload.NgayPH).toISOString()}`,
            NgayKT: `${new Date(payload.NgayKT).toISOString()}`,
            PhanTramGiam: Number(payload.PhanTramGiam),
            TrangThai: payload.TrangThai,
            TenSK: payload.TenSK,
          }),
        }
      );
    }
    if (response.status === 200 || response.status === 201) {
      onSave(payload);
    }
    else{
      alert("Lưu không thành công!");
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {promo ? "Chỉnh sửa Promotion" : "Thêm Promotion"}
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label className="text-sm">Tên sự kiện</Label>
            <Input
              value={form.TenSK}
              onChange={(e) => handleChange("TenSK", e.target.value)}
              placeholder="Tên sự kiện"
              disabled={form.MaSK ? isStartDatePastOrNow(form.NgayKT) : false}
            />
          </div>

          <div>
            <Label className="text-sm">Mô tả</Label>
            <Input
              value={form.MoTa}
              onChange={(e) => handleChange("MoTa", e.target.value)}
              placeholder="Mô tả sự kiện"
              disabled={form.MaSK ? isStartDatePastOrNow(form.NgayKT) : false}
            />
          </div>

          <div>
            <Label className="text-sm">Ngày bắt đầu</Label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                type="datetime-local"
                className="pl-8"
                value={formatDateForInput(form.NgayPH)}
                onChange={(e) => handleChange("NgayPH", e.target.value)}
                disabled={
                  (form.MaSK ? isStartDatePastOrNow(form.NgayPH) : false) ||
                  isStartDatePastOrNow(form.NgayKT)
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
                value={formatDateForInput(form.NgayKT)}
                onChange={(e) => handleChange("NgayKT", e.target.value)}
                disabled={form.MaSK ? isStartDatePastOrNow(form.NgayKT) : false}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm">Phần trăm giảm</Label>
            <Input
              value={form.PhanTramGiam}
              onChange={(e) => handleChange("PhanTramGiam", e.target.value)}
              placeholder="Phần trăm giảm"
              disabled={form.MaSK ? isStartDatePastOrNow(form.NgayKT) : false}
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Select
            value={form.TrangThai}
            onValueChange={(value) => handleChange("TrangThai", value)}
            disabled={form.MaSK ? isStartDatePastOrNow(form.NgayKT) : false}
          >
            <SelectTrigger
              className={`flex-1 ${
                form.TrangThai === "ACTIVE"
                  ? "bg-green-500 text-white font-semibold"
                  : "bg-red-500 text-white font-semibold"
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
            disabled={form.MaSK ? isStartDatePastOrNow(form.NgayKT) : false}
          >
            💾 Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
