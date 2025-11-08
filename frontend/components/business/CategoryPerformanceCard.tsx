import React from 'react'

type Item = {
  name: string // tên sản phẩm
  amount?: number | string // giá tiền
  change: number // phần trăm ( số lượng bán được tăng giảm bao nhiêu so với kỳ trước)
}

type Props = {
  title?: string
  items: Item[]
}

// Hàm định dạng tiền tệ
function formatCurrency(v?: number | string) {
  if (v === undefined || v === null) return ''
  if (typeof v === 'number') return v.toLocaleString('vi-VN') + '₫'
  return String(v)
}

// Component hiển thị thẻ hiệu suất theo danh mục
export default function CategoryPerformanceCard({ title = 'Hiệu suất theo danh mục', items }: Props) {
  return (
    <div className="mt-6 rounded-lg bg-white/90 dark:bg-slate-800/70 p-6 shadow-sm border border-slate-200 dark:border-slate-700 w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>

      <div className="mt-4 space-y-4 flex-1">
        {items.map((it) => {
          const positive = it.change >= 0
          const pillClass = positive ? 'bg-violet-500 text-white' : 'bg-rose-500 text-white'
          const sign = positive ? '+' : '-'

          return (
            <div key={it.name} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{it.name}</div>
                {it.amount !== undefined && (
                  <div className="text-xs text-slate-400 mt-1">{formatCurrency(it.amount)}</div>
                )}
              </div>

              <div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${pillClass}`}
                >
                  {sign}{Math.abs(Number(it.change)).toFixed(1)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
