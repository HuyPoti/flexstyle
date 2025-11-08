import { createClient } from "@/lib/supabase/server";
import ConfirmStockClient from "./ConfirmStockClient";
import { ChiTietNhapHang, PhieuNhapHang } from "@/lib/types";

export default async function Page() {
  const supabase = createClient();

  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  const PAGE_SIZE = 10;
  let initialReceipts: (PhieuNhapHang & {
    items: ChiTietNhapHang[];
    __computedTotal: number;
  })[] = [];
  let totalCount = 0;

  try {
    const headers: Record<string, string> = {};
    if (session && session.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phieunhaphang`, {
      headers,
    });
    const json = await res.json();
    const list = (json.data || json || []) as PhieuNhapHang[];

    // Ngày tạo mới nhất ở trên cùng
    list.sort((a, b) => {
      const da = new Date(a.created_at ?? a.created_at ?? 0).getTime();
      const db = new Date(b.created_at ?? b.created_at ?? 0).getTime();
      return db - da;
    });

    totalCount = list.length;
    const firstSlice = list.slice(0, PAGE_SIZE);

    // fetch chi tiết cho mỗi phiếu trong trang đầu tiên và tính tổng tiền
    initialReceipts = await Promise.all(
      firstSlice.map(async (r) => {
        const MaPNH = r.MaPNH ?? r.MaPNH ?? r.MaPNH;
        if (!MaPNH) return { ...r, items: [], __computedTotal: 0 };
        try {
          const dres = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chitietnhaphang/phieu/${MaPNH}`,
            { headers }
          );
          const djson = await dres.json();
          const items = djson.data || djson || [];
          const total = (items || []).reduce(
            (s: number, it: ChiTietNhapHang) =>
              s + (Number(it.SoLuong) || 0) * (Number(it.DonGia) || 0),
            0
          );
          return { ...r, items, __computedTotal: total };
        } catch (e) {
          console.error("detail fetch error", MaPNH, e);
          return { ...r, items: [], __computedTotal: 0 };
        }
      })
    );
  } catch (e) {
    console.error("Server fetch error", e);
  }

  return (
    <ConfirmStockClient
      initialReceipts={initialReceipts}
      totalCount={totalCount}
      pageSize={PAGE_SIZE}
      accessToken={session?.access_token || ""}
    />
  );
}
