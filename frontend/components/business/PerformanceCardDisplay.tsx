import React from 'react'
import CategoryPerformanceCard from './CategoryPerformanceCard'
import BestSellingProductsCard from './BestSellingProductsCard'

type CategoryPerformance = {
  name: string;
  amount: number;
};

type ProductPerformance = {
  name: string;
  sold: number;
  revenue: number;
};

export default function StatsCardsPreview({ thisMonthCategories, lastMonthCategories, thisMonthProducts }: { thisMonthCategories: CategoryPerformance[], lastMonthCategories: CategoryPerformance[], thisMonthProducts: ProductPerformance[] }) {
  const categoryItems = thisMonthCategories.map(category => ({
    name: category.name,
    amount: category.amount,
    change: ((category.amount - (lastMonthCategories.find(c => c.name === category.name)?.amount || 0)) / (lastMonthCategories.find(c => c.name === category.name)?.amount || 1)) * 100
  }));

  //chọn 3 sản phẩm bán chạy nhất
  const productItems = thisMonthProducts.map(product => ({
    name: product.name,
    sold: product.sold,
    revenue: product.revenue,
  }));
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="w-full h-full">
        <CategoryPerformanceCard items={categoryItems} />
      </div>

      <div className="w-full h-full">
        <BestSellingProductsCard items={productItems}
        />
      </div>
    </div>
  )
}