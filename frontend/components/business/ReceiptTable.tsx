"use client";

import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import type { ReceiptData, Item } from "@/interfaces/receipt";
// filter is controlled by parent (ConfirmStockClient)

interface ReceiptTableProps {
  receipts?: ReceiptData[];
  statusFilter?: string;
  onStatusChange?: (s: string) => void;
  onView?: (id?: string) => void;
  onLoadMore?: () => Promise<void> | void;
  hasMore?: boolean;
  loadingMore?: boolean;
  onReload?: () => Promise<void> | void;
}

const ALLOWED_STATUSES = new Set([
  "DANG_CHO",
  "NCC_XACNHAN",
  "NV_XACNHAN",
  "TU_CHOI",
]);

function formatCurrency(v?: number) {
  if (typeof v !== "number") return "-";
  return new Intl.NumberFormat("vi-VN").format(v) + " đ";
}

function getStatusInfo(statusRaw?: string) {
  const raw = statusRaw ?? "DANG_CHO";
  const status = ALLOWED_STATUSES.has(raw) ? raw : "DANG_CHO";
  switch (status) {
    case "NCC_XACNHAN":
      return {
        status,
        label: "Nhà cung cấp xác nhận",
        badge: "bg-green-100 text-green-700",
      };
    case "NV_XACNHAN":
      return {
        status,
        label: "Nhân viên xác nhận",
        badge: "bg-emerald-100 text-emerald-700",
      };
    case "TU_CHOI":
      return { status, label: "Từ chối", badge: "bg-red-100 text-red-600" };
    case "DANG_CHO":
    default:
      return {
        status: "DANG_CHO",
        label: "Đang chờ",
        badge: "bg-blue-100 text-blue-700",
      };
  }
}

export default function ReceiptTable({
  receipts = [],
  statusFilter: statusFilterProp = "ALL",
  onView,
  onLoadMore,
  hasMore,
  loadingMore,
  onReload,
}: ReceiptTableProps) {
  const business = receipts ?? [];
  function calcTotal(itms?: Item[], rawItems?: Item[], computed?: number) {
    if (typeof computed === "number") return computed;
    const list = itms ?? rawItems ?? [];
    return list.reduce(
      (s: number, it: Item) =>
        s + (Number(it?.SoLuong) || 0) * (Number(it?.DonGia) || 0),
      0
    );
  }

  const filtered = React.useMemo(() => {
    if (statusFilterProp === "ALL") return business;
    return business.filter(
      (b) => (b.TrangThai ?? "DANG_CHO") === statusFilterProp
    );
  }, [business, statusFilterProp]);

  function renderBusinessRows(list: ReceiptData[]) {
    if (!list || list.length === 0) {
      return (
        <tr>
          <td className="px-4 py-6 text-center text-gray-500" colSpan={6}>
            Không có dữ liệu
          </td>
        </tr>
      );
    }

    return list.map((r, idx) => {
      const { label: statusLabel, badge } = getStatusInfo(r.TrangThai);
      const total = calcTotal(r.items, undefined, undefined);
      const dateStr = r.created_at;

      return (
        <tr
          key={idx}
          className="border-b hover:bg-gray-50 transition-colors"
          data-id={r.MaPNH}
        >
          <td className="px-4 py-3 text-gray-700 text-left">
            {dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "-"}
          </td>
          <td className="px-4 py-3 text-gray-600 text-left">Kho FlexStyle</td>
          <td className="px-4 py-3 text-gray-600 text-left">
            Phường Chợ Quán, TP.HCM
          </td>
          <td className="px-4 py-3">
            <span
              title={statusLabel}
              className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center text-center whitespace-nowrap ${badge}`}
            >
              {statusLabel}
            </span>
          </td>
          <td className="px-4 py-3 text-gray-800 text-left">
            {formatCurrency(total)}
          </td>
          <td className="px-4 py-2 flex gap-2 justify-start">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => onView?.(r.MaPNH)}
            >
              <Eye className="w-4 h-4" />
              Xem
            </Button>
          </td>
        </tr>
      );
    });
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md border p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-t border-gray-200 table-fixed">
            <colgroup>
              <col style={{ width: "16.6667%" }} />
              <col style={{ width: "16.6667%" }} />
              <col style={{ width: "16.6667%" }} />
              <col style={{ width: "16.6667%" }} />
              <col style={{ width: "16.6667%" }} />
              <col style={{ width: "16.6667%" }} />
            </colgroup>
            <thead className="bg-gray-100 text-gray-700 font-medium">
              <tr className="border-b">
                <th className="text-left px-4 py-2">Ngày nhập hàng</th>
                <th className="text-left px-4 py-2">Nhập tại kho</th>
                <th className="text-left px-4 py-2">Địa chỉ</th>
                <th className="text-left px-4 py-2">Trạng thái</th>
                <th className="text-left px-4 py-2">Tổng tiền</th>
                <th className="text-left px-4 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>{renderBusinessRows(filtered)}</tbody>
          </table>
        </div>
        {/* Nút xem thêm */}
        {hasMore && (
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={onLoadMore}
              disabled={!!loadingMore}
            >
              {loadingMore ? "Đang tải..." : "Xem thêm"}
            </Button>
          </div>
        )}
        {/* Nút tải lại */}
        {onReload && (
          <div className="mt-2 flex justify-center">
            <Button variant="ghost" onClick={onReload}>
              Tải lại
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
