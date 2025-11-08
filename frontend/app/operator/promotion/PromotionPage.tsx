"use client";

import PromotionPopupChange from "@/components/operator/PromotionPopupChange";
import {useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import PromotionTable from "@/components/operator/PromotionTable";
import { Button } from "@/components/ui/button";
import { SuKienUuDai } from "@/lib/types";
import { ThongBao } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

export default function PromotionPage({
  promotions,
  notification,
}: {
  promotions: SuKienUuDai[];
  notification: ThongBao[];
}) {
  const [openChange, setOpenChange] = useState(false);
  const [promotionsChange, setPromotionChange] =
    useState<SuKienUuDai[]>(promotions);
  const [open, setOpen] = useState(false);
  const [idEdit, setIdEdit] = useState<SuKienUuDai | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDate, setSearchDate] = useState("");
  // State lưu danh sách sự kiện đã chọn
  const [selectedPromotionIds, setSelectedPromotionIds] = useState<string[]>(
    []
  );
  const [selectedPromotions, setSelectedPromotions] = useState<ThongBao[]>([]);
  useEffect(() => {
    setSelectedPromotions(notification);
    const ids = notification
      .map((note) => note.MaSK)
      .filter((id): id is string => !!id); // Remove null/undefined
    setSelectedPromotionIds(ids);
    console.log("notification", notification);
  }, [notification]);
  // Lọc danh sách theo các tiêu chí
  const filteredPromotions = promotionsChange.filter((promo) => {
    // Tìm theo tên
    const matchName = promo.TenSK.toLowerCase().includes(
      searchName.toLowerCase()
    );
    // Tìm theo trạng thái
    const matchStatus = searchStatus ? promo.TrangThai === searchStatus : true;
    // Tìm theo ngày nằm giữa NgayPH và NgayKT
    let matchDate = true;
    if (searchDate) {
      const date = new Date(searchDate).getTime();
      const start = new Date(promo.NgayPH).getTime();
      const end = new Date(promo.NgayKT).getTime();
      matchDate = date >= start && date <= end;
    }
    return matchName && matchStatus && matchDate;
  });
  const sortedPromotions = [...filteredPromotions].sort((a, b) => {
    const aSelected = selectedPromotionIds.includes(a.MaSK);
    const bSelected = selectedPromotionIds.includes(b.MaSK);
    if (aSelected === bSelected) return 0;
    return aSelected ? -1 : 1; // Đã chọn lên đầu
  });
  // Xử lý khi check/uncheck sự kiện
  // Xử lý khi check/uncheck sự kiện
  const handleCheckPromotion = (MaSK: string) => {
    setSelectedPromotionIds((prev) => {
      if (prev.includes(MaSK)) {
        return prev.filter((id) => id !== MaSK);
      } else {
        return [...prev, MaSK];
      }
    });
  };

  // Cập nhật selectedPromotions khi selectedPromotionIds thay đổi
  useEffect(() => {
    const selected = selectedPromotionIds
      .map((MaSK) => {
        const promo = promotionsChange.find((p) => p.MaSK === MaSK);
        if (promo) {
          return {
            MaTB: "",
            Loai: "SUKIENUUDAI",
            MaSK: promo.MaSK,
            MaVoucher: null,
          };
        }
        return null;
      })
      .filter(Boolean) as ThongBao[];
    setSelectedPromotions(selected);
    console.log("selectedPromotions", selected);
  }, [selectedPromotionIds, promotionsChange]);

  // Xử lý khi lưu danh sách sự kiện đã chọn
  const handleSaveSelected = async () => {
    // TODO: Gọi API lưu thông báo sự kiện
    const supabase = await createClient();
    const { data} = await supabase.auth.getSession();
    if (selectedPromotions.length === 0) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thongbao/sukienuudai/delete`,
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thongbao/sukienuudai/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data?.session?.access_token}`,
          },
          body: JSON.stringify(selectedPromotions),
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
        <div className="flex gap-2 items-center w-2/4">
          <div className="relative w-2/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4" />
            <Input
              placeholder="Tên sự kiện..."
              className="pl-10 bg-muted border-0 w-full"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <select
            className="bg-muted border rounded px-2 py-1 text-sm"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Còn hoạt động</option>
            <option value="INACTIVE">Tạm dừng</option>
          </select>
          <Input
            type="date"
            className="bg-muted border-0 text-sm w-36"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
        <div className="flex gap-5">
          <Button className="bg-green-500 ml-3" onClick={() => setOpen(true)}>
            Thêm sự kiện ưu đãi
          </Button>
          <Button className="bg-yellow-500" onClick={handleSaveSelected}>
            Lưu thông báo sự kiện
          </Button>
        </div>
      </div>
      <h2 className="font-bold text-xl">
        Hiện có {filteredPromotions.length} sự kiện
      </h2>
      <PromotionTable
        promotions={sortedPromotions}
        selectedPromotions={selectedPromotionIds}
        onSelectPromotion={handleCheckPromotion}
        onEdit={(promo) => {
          setIdEdit(promo);
          setOpenChange(true);
        }}
      />
      <PromotionPopupChange
        open={openChange}
        promo={idEdit}
        onClose={() => setOpenChange(false)}
        onSave={(data) => {
          setOpenChange(false);
          setIdEdit(null);
          setPromotionChange((prev) => {
            return prev.map((p) => (p.MaSK === data.MaSK ? data : p));
          });
        }}
      />
      <PromotionPopupChange
        open={open}
        promo={null}
        onClose={() => setOpen(false)}
        onSave={(data) => {
          setOpen(false);
          setIdEdit(null);
          setPromotionChange((prev) => {
            return [...prev, { ...data, MaSK: "" }];
          });
        }}
      />
    </div>
  );
}
