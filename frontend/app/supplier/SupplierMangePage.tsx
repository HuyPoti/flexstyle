"use client";

import React, { useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NccTable from "@/components/supplier/NccTable";
import axios from "axios";
import { type DateRange } from "react-day-picker";
import { ReceiptData } from "@/interfaces/receipt";

export default function SupplierPage({
  initData,
}: {
  initData: ReceiptData[];
}) {
  const supabase = createClient();
  const [nccs, setNccs] = useState<ReceiptData[]>(initData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  });

  const [trangthaiFilter, setTrangthaiFilter] = useState<string | null>(null);

  const handleDelete = async (id?: string) => {
    if (!id) return;
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
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phieunhaphang/${id}/nhacungcaptuchoi`,
        { NoiDung: "TU_CHOI" },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      alert("Tạo nhà cung cấp thành công");
    } catch (err: unknown) {
      setError(Array.isArray(err) ? JSON.stringify(err) : String(err));
    } finally {
      setLoading(false);
    }
    setNccs((prev) =>
      prev.map((f) => {
        if (f.MaPNH === id) f.TrangThai = "TU_CHOI";
        return f;
      })
    );
  };

  const handleStatusChange = (val: string) => {
    setTrangthaiFilter(val === "all" ? null : val);
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const filtered = useMemo(() => {
    if (!dateRange) return nccs;
    return nccs.filter((f) => {
      if (dateRange?.from && f.created_at) {
        const createdAtDate = new Date(f.created_at);
        if (createdAtDate < dateRange.from) return false;
      }
      if (dateRange?.to && f.created_at) {
        const createdAtDate = new Date(f.created_at);
        if (createdAtDate > dateRange.to) return false;
      }
      if (trangthaiFilter) {
        if (f.TrangThai !== trangthaiFilter) return false;
      }
      return true;
    });
  }, [nccs, trangthaiFilter, dateRange]);

  return (
    <div className="p-6">
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <Label htmlFor="date" className="px-1">
              Select Date Range
            </Label>
            <div className="relative flex gap-2">
              <Input
                id="date"
                value={
                  dateRange?.from && dateRange?.to
                    ? `${dateRange.from.toLocaleDateString(
                        "vi-VN"
                      )} - ${dateRange.to.toLocaleDateString("vi-VN")}`
                    : ""
                }
                placeholder="June 01, 2025"
                className="bg-background pr-10"
                readOnly={true}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setOpen(true);
                  }
                }}
              />
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="date-picker"
                    variant="ghost"
                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                  >
                    <CalendarIcon className="size-3.5" />
                    <span className="sr-only">Select date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0 bg-white"
                  align="center"
                  alignOffset={-8}
                  sideOffset={10}
                >
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateChange}
                    numberOfMonths={2}
                    className="rounded-lg border shadow-sm w-[350px] sm:w-[500px]"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <Select
                value={trangthaiFilter ?? "all"}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="NCC_XACNHAN">NCC_XACNHAN</SelectItem>
                  <SelectItem value="NV_XACNHAN">NV_XACNHAN</SelectItem>
                  <SelectItem value="DANG_CHO">DANG_CHO</SelectItem>
                  <SelectItem value="TU_CHOI_YEU_CAU">
                    TU_CHOI_YEU_CAU
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <NccTable nccs={filtered} onDelete={handleDelete} />
    </div>
  );
}
