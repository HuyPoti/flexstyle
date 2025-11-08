"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import ProductDetail from "@/interfaces/productDetail";

interface ProductViewPopupProps {
  open: boolean;
  onClose: () => void;
  productDetail?: ProductDetail[] | null;
}

export default function ProductViewPopup({
  open,
  onClose,
  productDetail,
}: ProductViewPopupProps) {
  const [rows, setRows] = useState<ProductDetail[]>([]);
  useEffect(() => {
    if (!open || !productDetail) {
      setRows([]);
      return;
    }
    setRows([...productDetail]);
  }, [open, productDetail]);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết tồn kho theo kích cỡ</DialogTitle>
        </DialogHeader>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Kích cỡ</th>
                <th className="px-4 py-2 border">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.MaCTSP} className="border-t">
                  <td className="px-4 py-2 border">{i + 1}</td>
                  <td className="px-4 py-2 border font-medium">{r.KichCo}</td>
                  <td className="px-4 py-2 border">{r.SoLuong}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DialogFooter className="mt-4 flex items-center gap-3">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4" /> Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
