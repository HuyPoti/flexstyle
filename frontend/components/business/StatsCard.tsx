import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

type Props = {
	title: string // tên thống kê
	value: number // giá trị thống kê (sẽ luôn là number)
	delta?: string // thay đổi
	deltaPositive?: boolean // tăng hay giảm
	icon?: React.ReactNode
	format?: 'currency' | 'number'
}

// Định dạng giá trị: currency (VND) hoặc plain number
function formatValue(v?: number, format: 'currency' | 'number' = 'currency') {
	if (v === undefined || v === null) return '';
	if (format === 'number') return v.toLocaleString('vi-VN');
	return v.toLocaleString('vi-VN') + '₫';
}

// Thẻ thống kê hiển thị một thẻ với tiêu đề, giá trị, thay đổi và biểu tượng
export default function StatsCard({ title, value, delta, deltaPositive = true, icon, format = 'currency' }: Props) {
	return (
		<div className="rounded-lg bg-white/90 dark:bg-slate-800/70 p-5 shadow-sm border border-slate-200 dark:border-slate-700 w-full">
			<div className="flex items-start justify-between">
				<h3 className="text-sm font-medium text-slate-800 dark:text-slate-100">{title}</h3>
				<div className="text-slate-400">{icon}</div>
			</div>

			<div className="mt-4 flex items-end gap-3">
				<div className="text-3xl font-bold text-slate-900 dark:text-white leading-none">
					{formatValue(value, format)}
				</div>
			</div>

			{delta && (
				<div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
					<span className={`inline-flex items-center ${deltaPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
						{deltaPositive ? (
							<TrendingUp className="w-4 h-4 mr-1" aria-hidden />
						) : (
							<TrendingDown className="w-4 h-4 mr-1" aria-hidden />
						)}
					</span>
					<span className={`${deltaPositive ? 'text-emerald-500' : 'text-rose-500'} font-medium`}>{delta}</span>
					<span className="text-slate-400 ml-2">so với tháng trước</span>
				</div>
			)}
		</div>
	)
}
