"use client";

import React, { useState, useEffect, useRef } from "react";
import { Download, Plus, X } from "lucide-react";
import { Item, ReceiptData } from "@/interfaces/receipt";
import { createClient } from "@/lib/supabase/client";

type ReceiptProps = {
  initial?: Partial<ReceiptData>;
  onCreate?: (data: ReceiptData) => void;
  isSubmitting?: boolean;
  supplierOptionsInitial?: {
    MaTK: string;
    DisplayName?: string;
    Email?: string;
  }[];
  variantOptionsInitial?: {
    MaCTSP: string;
    TenSP: string;
    KichCo: string;
    SoLuong: number;
  }[];
};

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("vi-VN").format(v) + "₫";

export default function Receipt({
  initial = {},
  onCreate,
  supplierOptionsInitial,
  variantOptionsInitial,
  isSubmitting = false,
}: ReceiptProps) {
  const supabase = createClient();
  const normalizeSuppliers = (
    list: unknown[] = []
  ): { MaTK: string; DisplayName?: string; Email?: string }[] => {
    if (!Array.isArray(list)) return [];
    return list
      .filter(
        (
          s
        ): s is {
          MaTK: string;
          DisplayName?: string;
          Email?: string;
          VAITRO?: string;
        } => {
          if (!s || typeof s !== "object" || !("MaTK" in s)) return false;
          const supplier = s as { MaTK: string; VAITRO?: string };
          return (
            supplier.VAITRO === undefined || String(supplier.VAITRO) === "NCC"
          );
        }
      )
      .map((s) => ({
        MaTK: s.MaTK,
        DisplayName: s.DisplayName,
        Email: s.Email,
      }));
  };
  const [supplierOptions] = useState<
    { MaTK: string; DisplayName?: string; Email?: string }[]
  >(normalizeSuppliers(supplierOptionsInitial ?? []));
  const [supplierId, setSupplierId] = useState<string | undefined>(
    initial.MaNCC ?? undefined
  );

  // chuẩn hóa danh sách variant từ props
  const normalizeVariants = (
    v: unknown
  ): {
    MaCTSP: string;
    MaSP?: string;
    TenSP: string;
    KichCo: string;
    SoLuong: number;
    GiaMua?: number;
  }[] => {
    if (!v) return [];
    let arr: unknown[] = [];
    if (Array.isArray(v)) arr = v;
    else if (
      typeof v === "object" &&
      v !== null &&
      "data" in v &&
      Array.isArray((v as { data?: unknown[] }).data)
    )
      arr = (v as { data?: unknown[] }).data ?? [];
    else if (typeof v === "object" && v !== null)
      arr = Object.values(v as object);
    else return [];

    return arr
      .filter(Boolean)
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const it = item as {
          MaCTSP: string;
          MaSP?: string;
          TenSP?: string;
          SANPHAM?: { TenSP?: string; GiaMua?: number };
          KichCo?: string;
          SoLuong?: number;
          GiaMua?: number;
        };
        return {
          MaCTSP: it.MaCTSP,
          MaSP: it.MaSP,
          TenSP: it.TenSP ?? it.SANPHAM?.TenSP ?? "",
          KichCo: it.KichCo ?? "",
          SoLuong: it.SoLuong ?? 0,
          GiaMua: it.GiaMua ?? it.SANPHAM?.GiaMua ?? 0,
        };
      })
      .filter(Boolean) as {
      MaCTSP: string;
      TenSP: string;
      KichCo: string;
      SoLuong: number;
      GiaMua?: number;
    }[];
  };

  const [variantOptions] = useState<
    {
      MaCTSP: string;
      MaSP?: string;
      TenSP: string;
      KichCo: string;
      SoLuong: number;
      GiaMua?: number;
    }[]
  >(normalizeVariants(variantOptionsInitial ?? []));

  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<
    {
      MaCTSP: string;
      MaSP?: string;
      TenSP: string;
      KichCo: string;
      SoLuong: number;
      GiaMua?: number;
    }[]
  >([]);

  const [searchTimer, setSearchTimer] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Hàm xuất phiếu hiện tại ra PDF dùng html2canvas + jsPDF
  async function exportToPdf() {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { default: jsPDF } = await import("jspdf");
      if (!rootRef.current) {
        alert("Không tìm thấy nội dung để xuất PDF");
        return;
      }

      const clone = rootRef.current.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("input, select, textarea").forEach((el) => {
        try {
          const tag = (el.tagName || "").toLowerCase();
          let text = "";

          if (
            (el as HTMLElement).dataset &&
            (el as HTMLElement).dataset.pdfSupplier === "true"
          ) {
            text = selectedSupplierName || "";
          } else if (
            tag === "input" &&
            (el as HTMLElement).dataset &&
            typeof (el as HTMLElement).dataset.pdfSizeIndex !== "undefined"
          ) {
            const idx = Number((el as HTMLElement).dataset.pdfSizeIndex);
            text =
              (items && items[idx] && (items[idx].KichCo ?? "")) ||
              (el as HTMLInputElement).value ||
              "";
          } else if (
            tag === "select" &&
            (el as HTMLElement).dataset &&
            typeof (el as HTMLElement).dataset.pdfSizeIndex !== "undefined"
          ) {
            const idx = Number((el as HTMLElement).dataset.pdfSizeIndex);
            text = (items && items[idx] && (items[idx].KichCo ?? "")) || "";
          } else if (tag === "input") {
            const inp = el as HTMLInputElement;
            if (inp.type === "checkbox" || inp.type === "radio") {
              text = inp.checked ? "✓" : "✗";
            } else {
              text = inp.value ?? "";
            }
          } else if (tag === "select") {
            const sel = el as HTMLSelectElement;
            // fallback to selected option text
            text =
              (sel.options[sel.selectedIndex] &&
                sel.options[sel.selectedIndex].text) ||
              sel.value ||
              "";
          } else if (tag === "textarea") {
            const ta = el as HTMLTextAreaElement;
            text = ta.value || "";
          }

          const span = document.createElement("div");
          span.textContent = text;
          span.style.whiteSpace = "pre-wrap";
          el.parentNode?.replaceChild(span, el);
        } catch {}
      });
      clone.querySelectorAll("button").forEach((n) => n.remove());

      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      try {
        clone.style.fontSize = "16px";
        clone.style.maxWidth = "900px";
      } catch (e) {
        console.log("Error setting clone styles:", e);
      }

      const canvas = await html2canvas(clone, { scale: 3 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const fileName = `phieu-nhap-${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-")}.pdf`;
      pdf.save(fileName);

      document.body.removeChild(wrapper);
    } catch (e) {
      console.error("Export PDF error", e);
    }
  }

  const selectedSupplierName =
    (supplierOptions || []).find((s) => s.MaTK === supplierId)?.DisplayName ||
    supplierId ||
    "";
  const [date, setDate] = useState<string>(
    (initial as { date?: string })?.date ?? ""
  );

  const [items, setItems] = useState<Item[]>(() => {
    const init = (initial as { items?: Item[] | Item })?.items;
    if (Array.isArray(init)) return init as Item[];
    if (init && typeof init === "object") return [init as Item];
    return [
      {
        MaCTSP: undefined,
        TenSP: "",
        KichCo: "",
        SoLuong: 0,
        DonGia: 0,
      },
    ];
  });
  // Tổng tiền (tính theo tất cả items)
  const total = items.reduce(
    (s, it) => s + (Number(it.SoLuong) || 0) * (Number(it.DonGia) || 0),
    0
  );

  // Hàm cập nhật thông tin sản phẩm cho một dòng
  function handleItemField<K extends keyof Item>(
    index: number,
    field: K,
    value: Item[K]
  ) {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function buildData(): ReceiptData {
    return {
      MaNCC: supplierId,
      created_at: date ? new Date(date) : new Date(),
      items: items,
    };
  }

  // Nhập hay ko nhập :D
  function validate(): string[] {
    const errors: string[] = [];
    if (!date) errors.push("Ngày nhập hàng không được để trống");
    if (!supplierId) errors.push("Bạn phải chọn nhà cung cấp (MaNCC)");
    items.forEach((it, idx) => {
      const prefix = `Sản phẩm #${idx + 1}: `;
      if (!it.TenSP || !String(it.TenSP).trim())
        errors.push(prefix + "Tên sản phẩm không được để trống");
      if (!it.KichCo || !String(it.KichCo).trim())
        errors.push(prefix + "Kích cỡ không được để trống");
      if (typeof it.SoLuong !== "number" || it.SoLuong <= 0)
        errors.push(prefix + "Số lượng phải lớn hơn 0");
      if (typeof it.DonGia !== "number" || it.DonGia <= 0)
        errors.push(prefix + "Đơn giá phải lớn hơn 0");
    });
    return errors;
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      const el = rootRef.current;
      if (!el.contains(e.target as Node)) {
        setSuggestions([]);
        setActiveRow(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [rootRef]);

  return (
    <div
      ref={rootRef}
      className="max-w-5xl mx-auto bg-white p-8 text-gray-800 font-sans text-base"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold">PHIẾU NHẬP HÀNG</h1>
        <div className="mt-2 text-sm grid grid-cols-2 gap-4 items-end">
          <div className="text-left">
            <label className="block text-xs text-gray-600">
              Ngày nhập hàng
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 border rounded px-2 py-1 w-full text-sm"
            />
          </div>

          <div className="text-left">
            <label className="block text-xs text-gray-600">
              Chọn nhà cung cấp
            </label>
            <select
              value={supplierId ?? ""}
              onChange={(e) => {
                const sel = e.target.value || undefined;
                setSupplierId(sel);
              }}
              className="mt-1 border rounded px-2 py-1 w-full text-sm"
              data-pdf-supplier="true"
            >
              <option value="">-- Chọn nhà cung cấp --</option>
              {supplierOptions && supplierOptions.length > 0 ? (
                supplierOptions.map((s) => (
                  <option key={s.MaTK} value={s.MaTK}>
                    {s.DisplayName ?? s.Email ?? s.MaTK}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Không có nhà cung cấp
                </option>
              )}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm">
        <div>
          <label className="block text-xs text-gray-600">
            Địa điểm nhập hàng
          </label>
          <div className="mt-1 text-sm text-gray-800">
            Nhập tại kho FlexStyle ở Quận A, Phường B, TP.HCM
          </div>
        </div>
      </div>

      <div className="mt-6 border border-gray-300">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="border px-3 py-2" style={{ width: "45%" }}>
                Tên
              </th>
              <th className="border px-3 py-2" style={{ width: "12%" }}>
                Kích cỡ
              </th>
              <th className="border px-3 py-2" style={{ width: "10%" }}>
                Số lượng
              </th>
              <th className="border px-3 py-2" style={{ width: "15%" }}>
                Đơn giá
              </th>
              <th className="border px-3 py-2" style={{ width: "18%" }}>
                Thành tiền
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx} className="text-sm align-top">
                <td
                  className="border px-3 py-2 text-left"
                  style={{ width: "50%" }}
                >
                  <div className="flex gap-2 relative">
                    {/* Tìm kiếm sản phẩm */}
                    <input
                      type="text"
                      value={it.TenSP || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleItemField(idx, "TenSP", val);
                        setActiveRow(idx);

                        if (searchTimer) window.clearTimeout(searchTimer);
                        const t = window.setTimeout(async () => {
                          try {
                            const {
                              data: { session },
                            } = await supabase.auth.getSession();
                            const token = session?.access_token;
                            const q = encodeURIComponent(val);
                            const res = await fetch(
                              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chitietnhaphang/variants/search?q=${q}`,
                              {
                                headers: token
                                  ? { Authorization: `Bearer ${token}` }
                                  : {},
                              }
                            );
                            const j = await res.json();
                            const list = normalizeVariants(j.data || j || []);
                            setSuggestions(list);
                          } catch {
                            setSuggestions([]);
                          }
                        }, 300);
                        setSearchTimer(t);
                      }}
                      placeholder="(nhập tên sản phẩm)"
                      className="w-full text-base"
                    />
                    {/* gợi ý sản phẩm */}
                    {activeRow === idx && suggestions.length > 0 && (
                      <div
                        className="absolute left-0 top-full z-50 bg-white border shadow rounded mt-2 max-h-72 overflow-auto w-full"
                        data-testid="suggestions"
                      >
                        {suggestions.map((s) => (
                          <div
                            key={s.MaCTSP}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              handleItemField(idx, "MaSP", s.MaSP);
                              handleItemField(idx, "TenSP", s.TenSP);
                              handleItemField(idx, "MaCTSP", undefined);
                              handleItemField(idx, "KichCo", "");
                              setSuggestions([]);
                              setActiveRow(null);
                            }}
                          >
                            {s.TenSP}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="border px-3 py-2 text-center">
                  {it.MaSP ? (
                    (() => {
                      const allSizes = Array.from(
                        new Set(
                          variantOptions
                            .filter((v) => v.MaSP === it.MaSP)
                            .map((v) => v.KichCo)
                        )
                      );
                      // Không chọn size trùng
                      const usedSizes = items
                        .map((other, i) => ({ other, i }))
                        .filter(({ i }) => i !== idx)
                        .filter(({ other }) => other && other.MaSP === it.MaSP)
                        .map(({ other }) => other.KichCo)
                        .filter(Boolean) as string[];

                      let available = allSizes.filter(
                        (sz) => !usedSizes.includes(sz)
                      );
                      if (it.KichCo && !available.includes(it.KichCo))
                        available = [it.KichCo, ...available];

                      return (
                        <select
                          value={it.KichCo ?? ""}
                          onChange={(e) => {
                            const selected = e.target.value;
                            handleItemField(idx, "KichCo", selected);
                            const found = variantOptions.find(
                              (v) => v.MaSP === it.MaSP && v.KichCo === selected
                            );
                            if (found) {
                              handleItemField(idx, "MaCTSP", found.MaCTSP);
                              if (found.GiaMua !== undefined)
                                handleItemField(
                                  idx,
                                  "DonGia",
                                  Number(found.GiaMua)
                                );
                            } else {
                              handleItemField(idx, "MaCTSP", undefined);
                            }
                          }}
                          className="w-full text-sm text-center"
                          data-pdf-size-index={String(idx)}
                        >
                          <option value="">-- Chọn kích cỡ --</option>
                          {available.map((sz) => (
                            <option key={sz} value={sz}>
                              {sz}
                            </option>
                          ))}
                        </select>
                      );
                    })()
                  ) : (
                    <input
                      type="text"
                      value={it.KichCo || ""}
                      onChange={(e) =>
                        handleItemField(idx, "KichCo", e.target.value)
                      }
                      className="w-full text-sm text-center"
                      data-pdf-size-index={String(idx)}
                    />
                  )}
                </td>
                <td className="border px-3 py-2 text-center">
                  <input
                    type="number"
                    min={0}
                    value={it.SoLuong}
                    onChange={(e) =>
                      handleItemField(idx, "SoLuong", Number(e.target.value))
                    }
                    className="w-full max-w-[100px] text-sm text-center mx-auto"
                  />
                </td>
                <td className="border px-3 py-2 text-center">
                  <input
                    type="number"
                    min={0}
                    value={it.DonGia}
                    onChange={(e) =>
                      handleItemField(idx, "DonGia", Number(e.target.value))
                    }
                    className="w-full max-w-[140px] text-sm text-right mx-auto"
                  />
                </td>
                {/* Tự tính thành tiền */}
                <td className="border px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div
                      className="whitespace-nowrap text-right"
                      title={formatCurrency(
                        (it.SoLuong || 0) * (it.DonGia || 0)
                      )}
                    >
                      {formatCurrency((it.SoLuong || 0) * (it.DonGia || 0))}
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        className="text-red-600 p-1 rounded"
                        onClick={() =>
                          setItems((prev) => prev.filter((_, i) => i !== idx))
                        }
                        title={`Xóa sản phẩm #${idx + 1}`}
                        aria-label={`Xóa sản phẩm ${idx + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Nút thêm sản phẩm */}
        <div className="mt-2">
          <button
            type="button"
            className="text-sm text-blue-600 p-1 rounded"
            onClick={() =>
              setItems((prev) => [
                ...prev,
                {
                  MaCTSP: undefined,
                  TenSP: "",
                  KichCo: "",
                  SoLuong: 0,
                  DonGia: 0,
                } as Item,
              ])
            }
            title="Thêm sản phẩm"
            aria-label="Thêm sản phẩm"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 text-base font-semibold">
        <div className="mt-2">
          <div
            className="text-base font-semibold"
            title={formatCurrency(total)}
          >
            Tổng số tiền (bằng số): {formatCurrency(total)}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 text-center text-sm">
        <div>
          <div className="font-bold">Người lập</div>
          <div className="italic text-gray-500 mt-8">(Ký, họ tên)</div>
        </div>
        <div>
          <div className="font-bold">Người giao</div>
          <div className="italic text-gray-500 mt-8">(Ký, họ tên)</div>
        </div>
        <div>
          <div className="font-bold">Quản lý kho</div>
          <div className="italic text-gray-500 mt-8">(Ký, họ tên)</div>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-6">
        {/* Tải xuống PDF */}
        <button
          onClick={() => exportToPdf()}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow"
        >
          <Download className="h-4 w-4" />
          Tải xuống PDF
        </button>
        {/* Tạo phiếu */}
        <button
          onClick={() => {
            const errors = validate();
            if (errors.length > 0) {
              alert(errors.join("\n"));
              return;
            }

            const data = buildData();
            if (onCreate) onCreate(data);
            else {
              alert("Tạo phiếu (placeholder)");
            }
          }}
          className={`bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded shadow ${
            isSubmitting ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang tạo..." : "Tạo phiếu"}
        </button>
      </div>
    </div>
  );
}
