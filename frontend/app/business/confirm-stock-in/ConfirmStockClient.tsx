"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";
import axios from "axios";
import ReceiptTable from "@/components/business/ReceiptTable";
import ReceiptView from "@/components/business/ReceiptView";
import type { ReceiptData } from "@/interfaces/receipt";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { toast } from "react-toastify";
import { ChiTietNhapHang, PhieuNhapHang } from "@/lib/types";

export default function ConfirmStockClient({
  initialReceipts = [],
  totalCount = 0,
  pageSize = 10,
  accessToken,
}: {
  initialReceipts?: (PhieuNhapHang & {
    items: ChiTietNhapHang[];
    __computedTotal: number;
  })[];
  totalCount?: number;
  pageSize?: number;
  accessToken?: string;
}) {
  const supabase = createClient();
  const [receipts, setReceipts] = React.useState<
    (PhieuNhapHang & {
      items: ChiTietNhapHang[];
      __computedTotal: number;
    })[]
  >(initialReceipts || []);
  const [loading, setLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<ReceiptData | null>(null);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState<number>(totalCount || 0);
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [dateFilter, setDateFilter] = React.useState<string | null>(null);
  const [tempDate, setTempDate] = React.useState<string | null>(null);

  React.useEffect(() => {
    const iv = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phieunhaphang/paged?page=1&pageSize=1&status=${encodeURIComponent(
            statusFilter
          )}${dateFilter ? `&date=${encodeURIComponent(dateFilter)}` : ""}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!res.ok) return;
        const json = await res.json();
        const newest = (json.data && json.data[0]) ?? null;
        if (!newest) return;
        const currentTop = receipts[0]?.MaPNH ?? receipts[0]?.MaPNH;
        if (currentTop !== (newest.MaPNH ?? newest.maPNH ?? newest.MaPNNH)) {
          // Nếu có phiếu nhập hàng mới -> tải lại trang đầu và thêm vào đầu danh sách
          const firstPageRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phieunhaphang/paged?page=1&pageSize=${pageSize}&status=${encodeURIComponent(
              statusFilter
            )}${dateFilter ? `&date=${encodeURIComponent(dateFilter)}` : ""}`,
            {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
          );
          if (!firstPageRes.ok) return;
          const pj = await firstPageRes.json();
          const newList = pj.data ?? [];
          setReceipts((prev) => {
            const seen = new Set(prev.map((p) => p.MaPNH));
            const toPrepend = newList.filter(
              (n: { MaPNH: string }) => !seen.has(n.MaPNH)
            );
            return [...toPrepend, ...prev];
          });
          setTotal(pj.totalCount ?? total);
        }
      } catch (e) {
        console.error("Auto-refresh fetch error", e);
      }
    }, 15000);
    return () => clearInterval(iv);
  }, [receipts, pageSize, statusFilter, dateFilter, total]);

  async function loadMore() {
    if (loadingMore) return;
    const next = page + 1;
    setLoadingMore(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phieunhaphang/paged?page=${next}&pageSize=${pageSize}&status=${encodeURIComponent(
          statusFilter
        )}${dateFilter ? `&date=${encodeURIComponent(dateFilter)}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.ok) throw new Error("Load more failed");
      const json = await res.json();
      const more = json.data ?? [];
      setReceipts((prev) => {
        const seen = new Set(prev.map((p) => p.MaPNH));
        const toAppend = more.filter(
          (m: { MaPNH: string }) => !seen.has(m.MaPNH)
        );
        return [...prev, ...toAppend];
      });
      setPage(next);
      setTotal(json.totalCount ?? total);
    } catch (e) {
      console.error("Load more error", e);
    } finally {
      setLoadingMore(false);
    }
  }

  // Tải lại danh sách với bộ lọc hiện tại
  async function reload(status?: string, dateArg?: string | null) {
    setLoading(true);
    try {
      const s = typeof status === "string" ? status : statusFilter;
      const d = typeof dateArg !== "undefined" ? dateArg : dateFilter;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phieunhaphang/paged?page=1&pageSize=${pageSize}&status=${encodeURIComponent(
          s
        )}${d ? `&date=${encodeURIComponent(d)}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.ok) throw new Error("Reload failed");
      const json = await res.json();
      const first = json.data ?? [];
      setReceipts(first);
      setPage(1);
      setTotal(json.totalCount ?? total);
    } catch (e) {
      console.error("Reload error", e);
    } finally {
      setLoading(false);
    }
  }

  async function confirmAsStaff(id?: string) {
    if (!id) return;
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Bạn chưa đăng nhập");
        return;
      }
      const accessToken = session.access_token;
      const userId = session.user?.id;
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phieunhaphang/${id}/nhanvienxacnhan`,
        { MaTKNVXN: userId, NoiDung: "NV_XACNHAN" },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setReceipts((prev) =>
        prev.map((r) =>
          (r.MaPNH ?? r.MaPNH) === id
            ? { ...r, status: "NV_XACNHAN", TrangThai: "NV_XACNHAN" }
            : r
        )
      );
      setSelected((prev: ReceiptData | null) => {
        if (!prev) return prev;
        const pid = prev.MaPNH;
        if (pid === id)
          return {
            ...prev,
            status: "NV_XACNHAN",
            TrangThai: "NV_XACNHAN",
          };
        return prev;
      });
      toast.success("Xác nhận phiếu thành công");
    } catch (err) {
      console.error("Confirm as staff error", err);
      toast.error("xác nhận thất bại");
    } finally {
      setLoading(false);
    }
  }

  // Xử lý khi người dùng xem chi tiết một phiếu nhập hàng
  function handleView(id?: string) {
    const found = receipts.find((r) => r.MaPNH === id);
    if (!found) {
      setSelected(null);
      setViewOpen(false);
      return;
    }
    setSelected(found);
    setViewOpen(true);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Danh sách phiếu nhập hàng</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-56 relative">
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                const val = v as string;
                setStatusFilter(val);
                reload(val);
              }}
            >
              <SelectTrigger className="w-full relative pl-9 pr-9 border-gray-200">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"ALL"}>Tất cả</SelectItem>
                <SelectItem value={"DANG_CHO"}>Đang chờ</SelectItem>
                <SelectItem value={"NV_XACNHAN"}>Nhân viên xác nhận</SelectItem>
                <SelectItem value={"NCC_XACNHAN"}>
                  Nhà cung cấp xác nhận
                </SelectItem>
                <SelectItem value={"TU_CHOI"}>Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="border border-gray-200 rounded px-3 py-2 text-sm"
              value={tempDate ?? dateFilter ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setTempDate(v ? v : null);
              }}
            />
            {tempDate !== dateFilter ? (
              <>
                <button
                  type="button"
                  className="bg-primary text-white px-3 py-1 rounded text-sm"
                  onClick={() => {
                    setDateFilter(tempDate);
                    reload(undefined, tempDate ?? null);
                  }}
                >
                  Áp dụng
                </button>
                <button
                  type="button"
                  className="text-sm text-muted-foreground underline"
                  onClick={() => {
                    setTempDate(dateFilter);
                  }}
                >
                  Hủy
                </button>
              </>
            ) : dateFilter ? (
              <button
                type="button"
                className="text-sm text-muted-foreground underline"
                onClick={() => {
                  setDateFilter(null);
                  setTempDate(null);
                  reload(undefined, null);
                }}
              >
                Xóa
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {loading && (
        <div className="text-center my-4">
          <span>Đang tải dữ liệu...</span>
          {/* Hoặc dùng spinner/icon nếu có */}
        </div>
      )}
      <ReceiptTable
        receipts={receipts}
        statusFilter={statusFilter}
        onStatusChange={(s?: string) => {
          if (s) {
            setStatusFilter(s);
            reload(s);
          }
        }}
        onView={(id?: string) => handleView(id)}
        onLoadMore={loadMore}
        hasMore={receipts.length < total}
        loadingMore={loadingMore}
        onReload={reload}
      />

      <ReceiptView
        open={viewOpen}
        onOpenChange={(o) => setViewOpen(o)}
        data={selected ?? undefined}
        onConfirm={() => {
          const id = selected?.MaPNH;
          if (id) confirmAsStaff(id);
        }}
      />
    </div>
  );
}
