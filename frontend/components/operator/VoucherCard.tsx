"use client";

import { Calendar, Pencil} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Voucher } from "@/lib/types";
import { Separator } from "../ui/separator";

interface VoucherCardProps {
  voucher: Voucher;
  onEdit: (voucher: Voucher) => void;
}
const formatDate = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${hour}:${minute} ${day}/${month}/${year}`;
};
export default function VoucherCard({ voucher, onEdit }: VoucherCardProps) {
  return (
    <Card className="w-[380px] border-l-8 border-l-yellow-300 shadow-xl rounded-xl h-full">
      <CardContent className="p-5 flex flex-col h-full">
        {/* Header */}
        <h2 className="text-xl font-bold">{voucher.TenVoucher}</h2>
        <Separator className="border-t-2 border-t-purple-600 mt-2" />
        <h3 className="text-lg font-semibold mt-1">
          Loại Voucher: {voucher.Loai}
        </h3>
        <div className="flex items-center text-[0.8rem] text-gray-600">
          <Calendar className="w-4 mr-1" />
          {formatDate(voucher.NgayBatDau)} - {formatDate(voucher.NgayKetThuc)}
        </div>
        <div>
          <p className="text-lg text-gray-500 mt-3">{voucher.MoTa}</p>
        </div>
        <div className="mt-auto">
          <div>
            <p className="text-gray-800 text-xl font-semibold mt-4">
              {voucher.Code}
            </p>
          </div>
          {/* Date and status */}

          {/* Code */}
          <div className="flex justify-around items-center">
            {/* Buttons */}
            <div className=" bg-green-600 px-5 py-1 rounded-full mt-2">
              <span className="text-white font-semibold text-xl ">
                {voucher.TrangThai}
              </span>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button
                onClick={() => onEdit?.(voucher)}
                size="sm"
                variant="outline"
                className="flex items-center gap-1 border-none"
              >
                <Pencil className="w-4 h-4" />
                Chỉnh sửa
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
