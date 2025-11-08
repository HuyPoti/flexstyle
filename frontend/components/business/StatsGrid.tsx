import React from 'react'
import StatsCard from './StatsCard'
import {DollarSign, Users } from 'lucide-react'

// Lưới thống kê hiển thị các thẻ thống kê
export default function StatsGrid({ thisMonthRevenue, lastMonthRevenue, thisMonthCustomers, lastMonthCustomers }: { thisMonthRevenue?: number; lastMonthRevenue?: number; thisMonthCustomers?: number; lastMonthCustomers?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatsCard
        title="Tổng doanh thu tháng này"
        value={thisMonthRevenue || 0}
        delta={lastMonthRevenue ? `${(((thisMonthRevenue || 0) - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(2)}%` : undefined}
        deltaPositive={lastMonthRevenue ? (thisMonthRevenue || 0) - lastMonthRevenue > 0 : undefined}
        icon={<DollarSign className="w-6 h-6 text-slate-400" />}
      />

      {/* <StatsCard
        title="Tổng hóa đơn"
        value={1025}
        format="number"
        delta="+8.2%"
        deltaPositive={true}
        icon={<ShoppingCart className="w-6 h-6 text-slate-400" />}
      /> */}

      <StatsCard
        title="Khách hàng mới tháng này"
        value={thisMonthCustomers || 0}
        format="number"
        delta={lastMonthCustomers ? `${(((thisMonthCustomers || 0) - lastMonthCustomers) / lastMonthCustomers * 100).toFixed(2)}%` : undefined}
        deltaPositive={lastMonthCustomers ? (thisMonthCustomers || 0) - lastMonthCustomers > 0 : undefined}
        icon={<Users className="w-6 h-6 text-slate-400" />}
      />
    </div>
  )
}
