"use client";
import VoucherCard from "@/components/operator/VoucherCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import VoucherPopup from "@/components/operator/VoucherPopup";
import { useEffect, useState } from "react";
import { ThongBao, Voucher } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface VoucherPageProps {
  vouchers: Voucher[];
  notifications: ThongBao[];
  onEdit?: (id: string) => void;
}

export default function VoucherPage({
  vouchers,
  notifications,
}: VoucherPageProps) {
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<Voucher | null>(null);
  const [openChange, setOpenChange] = useState(false);
  const [voucherList, setVoucherList] = useState<Voucher[]>(vouchers);
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [selectedVouchers, setSelectedVouchers] =
    useState<ThongBao[]>(notifications);

  useEffect(() => {
    setVoucherList(vouchers);
  }, [vouchers]);
  useEffect(() => {
    setSelectedVouchers(notifications);
  }, [notifications]);
  // Lọc theo tên, loại, trạng thái, ngày
  const filteredVouchers = voucherList.filter((voucher) => {
    const keyword = search.trim().toLowerCase();
    // Tìm theo tên, loại, trạng thái
    const matchName = voucher.TenVoucher.toLowerCase().includes(keyword);
    const matchLoai = voucher.Loai.toLowerCase().includes(keyword);
    const matchStatus = voucher.TrangThai.toLowerCase().includes(keyword);
    // Tìm theo ngày nằm giữa NgayBatDau và NgayKetThuc
    let matchDate = true;
    if (searchDate) {
      const date = new Date(searchDate).getTime();
      const start = new Date(voucher.NgayBatDau).getTime();
      const end = new Date(voucher.NgayKetThuc).getTime();
      matchDate = date >= start && date <= end;
    }
    return (matchName || matchLoai || matchStatus) && matchDate;
  });
  // State lưu danh sách voucher đã chọn

  // Xử lý khi check/uncheck voucher
  const handleCheckVoucher = (MaVoucher: string) => {
    const isAlreadySelected = selectedVouchers.some(
      (tb) => tb.MaVoucher === MaVoucher
    );
    if (!isAlreadySelected) {
      const voucherToAdd = voucherList.find((v) => v.MaVoucher === MaVoucher);
      if (voucherToAdd) {
        setSelectedVouchers((prev) => [
          ...prev,
          {
            MaTB: "",
            Loai: "VOUCHER",
            MaSK: null,
            MaVoucher: voucherToAdd.MaVoucher,
          },
        ]);
      }
    } else {
      setSelectedVouchers((prev) =>
        prev.filter((tb) => tb.MaVoucher !== MaVoucher)
      );
    }
  };

  const sortedVouchers = [...filteredVouchers].sort((a, b) => {
    const aSelected = selectedVouchers.some(
      (tb) => tb.MaVoucher === a.MaVoucher
    );
    const bSelected = selectedVouchers.some(
      (tb) => tb.MaVoucher === b.MaVoucher
    );
    if (aSelected === bSelected) return 0;
    return aSelected ? -1 : 1;
  });

  // Xử lý khi lưu danh sách voucher đã chọn
  const handleSaveSelected = async () => {
    const supabase = await createClient();
    const { data} = await supabase.auth.getSession();
    if (selectedVouchers.length === 0) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thongbao/voucher/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.session?.access_token}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        alert("Xoá thành công!");
      } else {
        alert("Xoá không thành công!");
      }
    } else {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thongbao/voucher/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.session?.access_token}`,
          },
          body: JSON.stringify(selectedVouchers),
        }
      );
      console.log("Response status:", response);
      if (response.status === 200 || response.status === 201) {
        alert("Update thành công!");
      } else {
        alert("Update không thành công!");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center w-3/4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tên, loại, trạng thái..."
              className="pl-10 bg-muted border-0 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Input
            type="date"
            className="bg-muted border-0 text-sm w-36"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
        <div className="flex gap-5">
          <Button className="bg-green-500 ml-3" onClick={() => setOpen(true)}>
            Thêm voucher
          </Button>
          <Button
            // size="sm"
            className="bg-yellow-500"
            onClick={handleSaveSelected}
          >
            Lưu thông báo voucher
          </Button>
        </div>
      </div>
      <h2 className="font-bold text-xl">
        Hiện có {filteredVouchers.length} voucher
      </h2>
      <div className="flex flex-wrap gap-6">
        {sortedVouchers.map((voucher) => (
          <div key={voucher.MaVoucher} className="relative h-120 ">
            <VoucherCard
              onEdit={(voucher) => {
                setIsEdit(voucher);
                setOpenChange(true);
              }}
              voucher={voucher}
            />
            <div className="absolute top-5 right-5 z-10">
              <label className="flex items-center gap-1 cursor-pointer">
                <Input
                  type="checkbox"
                  checked={selectedVouchers.some(
                    (tb) => tb.MaVoucher === voucher.MaVoucher
                  )}
                  onChange={() => handleCheckVoucher(voucher.MaVoucher)}
                  className="accent-primary h-4 w-4"
                />
                <span className="text-xs font-medium text-primary">Chọn</span>
              </label>
            </div>
          </div>
        ))}
      </div>

      <VoucherPopup
        open={open}
        voucher={null}
        onClose={() => setOpen(false)}
        onSave={(data) => {
          console.log("Saved voucher:", data);
        }}
      />
      <VoucherPopup
        open={openChange}
        voucher={isEdit}
        onClose={() => setOpenChange(false)}
        onSave={(data) => {
          setVoucherList((prev) =>
            prev.map((p) => (p.MaVoucher === data.MaVoucher ? data : p))
          );
        }}
      />
    </div>
  );
}
