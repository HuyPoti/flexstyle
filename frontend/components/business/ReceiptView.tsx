"use client";

import React from "react";
import axios from "axios";
const supplierCache = new Map<string, string>();
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Item, ReceiptData } from "@/interfaces/receipt";

export default function ReceiptView({
  open,
  onOpenChange,
  data,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: ReceiptData;
  onConfirm?: () => void;
}) {
  const items = (data?.items ?? []) as Item[];
  const normalizedItems: Item[] = (items || []).map((it) => ({
    MaCTNH: it.MaCTNH,
    MaPNH: it.MaPNH,
    MaCTSP: it.MaCTSP,
    MaSP: it.MaSP,
    TenSP: it.TenSP ?? "",
    KichCo: it.KichCo ?? "",
    SoLuong: Number(it.SoLuong) || 0,
    DonGia:
      typeof it.DonGia === "number"
        ? it.DonGia
        : Number(it.DonGia) || undefined,
  }));

  const [itemsState, setItemsState] = React.useState<Item[]>(normalizedItems);

  const [supplierNameLocal, setSupplierNameLocal] = React.useState<
    string | undefined
  >(() => {
    return undefined;
  });

  React.useEffect(() => {
    let mounted = true;
    const ma = data?.MaNCC ?? null;
    if (!ma) return;
    const key = String(ma);
    if (supplierCache.has(key)) {
      setSupplierNameLocal(supplierCache.get(key));
      return;
    }
    (async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ncc/public`);
        const list = res?.data?.data ?? res?.data ?? [];
        const found = (list || []).find(
          (x: {
            MaTK?: string;
            MaNCC?: string;
            id?: string;
            DisplayName?: string;
            TenNCC?: string;
            TenNhaCungCap?: string;
            Displayname?: string;
          }) =>
            String(x.MaTK ?? x.MaNCC ?? x.id) === key ||
            String(x.MaTK ?? x.MaNCC ?? x.id) === String(ma)
        );
        const name =
          found?.DisplayName ??
          found?.TenNCC ??
          found?.TenNhaCungCap ??
          found?.Displayname ??
          undefined;
        if (name) supplierCache.set(key, name);
        if (mounted) setSupplierNameLocal(name);
      } catch (e) {
        // ignore
        console.error("Error fetching supplier name:", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [data]);

  React.useEffect(() => {
    let mounted = true;
    const base: Item[] = (data?.items ?? []).map((it) => ({
      MaCTNH: it.MaCTNH,
      MaPNH: it.MaPNH,
      MaCTSP: it.MaCTSP,
      MaSP: it.MaSP,
      TenSP: it.TenSP ?? "",
      KichCo: it.KichCo ?? "",
      SoLuong: Number(it.SoLuong) || 0,
      DonGia:
        typeof it.DonGia === "number"
          ? it.DonGia
          : Number(it.DonGia) || undefined,
    }));
    setItemsState(base);

    const need = Array.from(
      new Set(
        base
          .filter((b) => (!b.TenSP || !b.KichCo) && (b.MaCTSP || b.MaSP))
          .map((b) => b.MaCTSP ?? b.MaSP)
      )
    );
    if (need.length === 0) return;

    (async () => {
      try {
        const promises = need.map((c) =>
          axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chitietnhaphang/variants/${encodeURIComponent(
              String(c)
            )}`
          )
        );
        const results = await Promise.allSettled(promises);
        const map: Record<string, Item> = {};
        for (const r of results) {
          if (r.status === "fulfilled" && r.value?.data) {
            const payload = r.value.data?.data ?? r.value.data;
            if (payload) map[String(payload.MaCTSP ?? payload.MaSP)] = payload;
          }
        }
        if (!mounted) return;
        setItemsState((prev) =>
          prev.map((it) => {
            const code = it.MaCTSP ?? it.MaSP;
            if (!code) return it;
            const v = map[String(code)];
            if (!v) return it;
            return {
              ...it,
              TenSP: it.TenSP || v.TenSP || "",
              KichCo: it.KichCo || v.KichCo || "",
              DonGia: it.DonGia ?? v.DonGia ?? undefined,
            };
          })
        );
      } catch (e) {
        // ignore enrichment errors
        console.error("Error enriching receipt items:", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [data]);

  const total = itemsState.reduce(
    (s, it) => s + Number(it.DonGia ?? 0) * Number(it.SoLuong ?? 0),
    0
  );
  const status = (data?.TrangThai as string) ?? "DANG_CHO";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden w-full max-w-[1100px] sm:max-w-[1100px] md:max-w-[1200px] max-h-[90vh]">
        <DialogTitle className="sr-only">Phiếu nhập hàng</DialogTitle>
        {/* Header band */}
        <div className="w-full bg-[#8B5CF6] py-8 text-center">
          <h3 className="text-white text-xl font-semibold tracking-wider">
            PHIẾU NHẬP HÀNG
          </h3>
        </div>

        <div
          className="p-6 bg-white overflow-auto"
          style={{ maxHeight: "calc(90vh - 120px)" }}
        >
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <div className="text-sm font-medium text-gray-700">
                Ngày nhập hàng
              </div>
              <div className="mt-1 text-gray-900">
                {data?.created_at
                  ? new Date(String(data.created_at)).toLocaleString()
                  : "-"}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">
                Nhà cung cấp
              </div>
              <div className="mt-1 text-gray-900">
                {supplierNameLocal ?? data?.MaNCC ?? "-"}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">
                Nhập tại kho
              </div>
              <div className="mt-1 text-gray-900">Kho FlexStyle</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Địa chỉ</div>
              <div className="mt-1 text-gray-900">Phường Chợ Quán, TP.HCM</div>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-md">
            <table className="min-w-full text-sm table-fixed">
              <colgroup>
                <col style={{ width: "40%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "14%" }} />
              </colgroup>
              <thead className="bg-gray-100 text-gray-700 font-medium">
                <tr>
                  <th className="text-left px-4 py-2">Tên</th>
                  <th className="text-left px-4 py-2">Kích cỡ</th>
                  <th className="text-left px-4 py-2">Số lượng</th>
                  <th className="text-left px-4 py-2">Đơn giá</th>
                  <th className="text-left px-4 py-2">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {itemsState.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-gray-500"
                      colSpan={5}
                    >
                      Không có sản phẩm
                    </td>
                  </tr>
                ) : (
                  itemsState.map((it, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-3 text-gray-700">
                        {it.TenSP ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {it.KichCo ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {it.SoLuong ?? 0}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {typeof it.DonGia === "number"
                          ? new Intl.NumberFormat("vi-VN").format(it.DonGia) +
                            " đ"
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {typeof it.DonGia === "number" &&
                        typeof it.SoLuong === "number"
                          ? new Intl.NumberFormat("vi-VN").format(
                              (it.DonGia ?? 0) * (it.SoLuong ?? 0)
                            ) + " đ"
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 gap-4">
            <div>
              <div className="text-sm font-semibold">
                Tổng số tiền:
                <span className="ml-2 text-lg font-semibold text-gray-900">
                  {new Intl.NumberFormat("vi-VN").format(total)} đ
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-white">
          <div className="flex gap-3 mx-auto">
            {status === "NCC_XACNHAN" ? (
              <Button
                variant="default"
                onClick={() => {
                  onConfirm?.();
                  onOpenChange(false);
                }}
              >
                Xác nhận
              </Button>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
