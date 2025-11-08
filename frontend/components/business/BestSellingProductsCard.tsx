import React from 'react'

type Item = {
  name: string // tên sản phẩm
  sold?: number // số lượng đã bán
  revenue?: number // tổng doanh thu
}

type Props = {
  title?: string
  items: Item[]
}

// Hàm định dạng tiền tệ
function formatCurrency(v?: number) {
  if (v === undefined || v === null) return ''
  return v.toLocaleString('vi-VN') + '₫'
}

// Component hiển thị thẻ sản phẩm bán chạy
export default function BestSellingProductsCard({ title = 'Sản phẩm bán chạy', items }: Props) {
  return (
    <div className="mt-6 rounded-lg bg-white/90 dark:bg-slate-800/70 p-6 shadow-sm border border-slate-200 dark:border-slate-700 w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <div className="mt-4 space-y-5 flex-1">
        {items.map((it) => (
          <div key={it.name} className="flex items-start justify-between">
            <div>
              <div className="text-sm text-slate-800 dark:text-slate-100">{it.name}</div>
              {it.sold !== undefined && (
                <div className="text-xs text-slate-400 mt-1">{it.sold} đã bán</div>
              )}
            </div>

            <div className="text-right">
              <div className="text-base font-bold text-slate-900 dark:text-white">{formatCurrency(it.revenue)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
