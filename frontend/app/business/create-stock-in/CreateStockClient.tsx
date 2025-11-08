"use client";

import React from "react";
import { DateTime } from "luxon";
import Receipt from "@/components/business/Receipt";
import { ReceiptData } from "@/interfaces/receipt";
import { createClient } from "@/lib/supabase/client";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Variant = {
  MaCTSP: string;
  TenSP: string;
  KichCo: string;
  SoLuong: number;
};
type Supplier = { MaTK: string; DisplayName?: string; Email?: string };

export default function CreateStockClient({
  supplierOptionsInitial = [],
  variantOptionsInitial = [],
}: {
  supplierOptionsInitial?: Supplier[];
  variantOptionsInitial?: Variant[];
}) {
  const supabase = createClient();
  const [isCreating, setIsCreating] = React.useState(false);

  const onCreate = async (data: ReceiptData) => {
    setIsCreating(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Bạn chưa đăng nhập");
        setIsCreating(false);
        return;
      }
      const accessToken = session.access_token;
      const userId = (session.user as { id?: string })?.id;

      if (!data.MaNCC) {
        toast.error("Vui lòng chọn nhà cung cấp");
        return;
      }

      const itemsRaw = (data.items ?? []) as Array<{
        MaCTSP: string;
        SoLuong: number;
        DonGia?: number;
      }>;
      const filtered = itemsRaw
        .filter((it) => it.MaCTSP && String(it.MaCTSP).trim())
        .map((it) => ({
          MaCTSP: it.MaCTSP,
          SoLuong: Number(it.SoLuong) || 0,
          DonGia: Number(it.DonGia) || 0,
        }));

      const totalQty = filtered.reduce(
        (s, it) => s + (Number(it.SoLuong) || 0),
        0
      );

      if (filtered.length === 0) {
        toast.error("Không có sản phẩm hợp lệ (không có MaCTSP).");
        return;
      }

      const createdAtIsoVn = DateTime.now().setZone("Asia/Ho_Chi_Minh").toISO();

      const payload: {
        MaNCC: string;
        MaTKNVQL: string | undefined;
        created_at: string;
        NoiDung: string;
        TrangThai: string;
        SoLuong: number;
      } = {
        MaNCC: data.MaNCC,
        MaTKNVQL: userId,
        created_at: createdAtIsoVn,
        NoiDung: (data as { NoiDung?: string }).NoiDung ?? "",
        TrangThai: "DANG_CHO",
        SoLuong: totalQty,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phieunhaphang`,
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const created: { MaPNH?: string; maPNH?: string } =
        res.data?.data ?? res.data;
      const MaPNH = created?.MaPNH ?? created?.maPNH;
      if (!MaPNH) {
        toast.error("Tạo phiếu thất bại: không nhận được MaPNH từ server");
        console.error("Create phieu response", res.data);
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chitietnhaphang/phieu/${MaPNH}`,
        filtered,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      toast.success("Tạo phiếu nhập hàng thành công");
    } catch (err) {
      let messageToShow: string = "Tạo thất bại";
      if (axios.isAxiosError(err)) {
        const serverData = err.response?.data;
        if (typeof serverData === "string") messageToShow = serverData;
        else if (typeof serverData === "object")
          messageToShow = JSON.stringify(serverData, null, 2);
        else messageToShow = err.message ?? "Tạo thất bại";
      } else if (err instanceof Error) {
        messageToShow = err.message;
      }
      toast.error(String(messageToShow));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Receipt
        onCreate={onCreate}
        isSubmitting={isCreating}
        supplierOptionsInitial={supplierOptionsInitial}
        variantOptionsInitial={variantOptionsInitial}
      />
    </div>
  );
}
