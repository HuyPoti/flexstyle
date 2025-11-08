"use client";

import React from "react";
// import StatsGrid from '../../../components/business/StatsGrid'
// import PerformanceCardDisplay from "../../../components/business/PerformanceCardDisplay";
import StatsChart from "../../../components/business/StatsChart";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ThongKeDoanhThuItem } from "@/lib/types";
import { toast, ToastContainer } from "react-toastify";
import StatsGrid from "@/components/business/StatsGrid";
import { ThongKeSLKhachHangItem } from "@/lib/types";
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
type CountPoint = {
  month: string;
  orders?: number | null; // đơn hàng
  customers?: number | null; // khách hàng
};
type MonthlyPoint = {
  month: string;
  revenue?: number | null; // doanh thu
  capital?: number | null; // vốn
};

type CategoryPerformance = {
  name: string;
  amount: number;
};

type ProductPerformance = {
  name: string;
  sold: number;
  revenue: number;
};

// Trả về 2 mảng: 1 mảng dữ liệu doanh thu/vốn, 1 mảng số đơn hàng
function mapThongKeToMonthlyPoints(stats: ThongKeDoanhThuItem[]): {
  chartData: MonthlyPoint[];
  ordersData: { month: string; orders: number }[];
  categoryAndProductData: {
    month: string;
    categories: CategoryPerformance[];
    products: ProductPerformance[];
  }[];
} {
  const now = new Date();
  const months: { label: string; year: number; month: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: MONTHS[d.getMonth()],
      year: d.getFullYear(),
      month: d.getMonth() + 1,
    });
  }

  const chartData: MonthlyPoint[] = [];
  const ordersData: { month: string; orders: number }[] = [];
  const categoryAndProductData: {
    month: string;
    categories: CategoryPerformance[];
    products: ProductPerformance[];
  }[] = [];

  for (const { label, year, month } of months) {
    const items = (stats || []).filter((s) => {
      const d = new Date(s.DONHANG.created_at);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
    const revenue = items.reduce(
      (sum, s) => sum + (s.DONHANG.TongTien || 0),
      0
    );
    const capital = items.reduce(
      (sum, s) =>
        sum +
        (s.DONHANG.CHITIETSANPHAM.SANPHAM.GiaMua * s.DONHANG.SoLuong || 0),
      0
    );
    const numberOfOrders = items.length;

    // Tính hiệu suất theo danh mục và sản phẩm
    const categoryMap: Record<string, number> = {};
    const productMap: Record<string, { sold: number; revenue: number }> = {};

    for (const s of items) {
      const categoryName = s.DONHANG.CHITIETSANPHAM.SANPHAM.DANHMUC.TenDM;
      const productName = s.DONHANG.CHITIETSANPHAM.SANPHAM.TenSP;
      const productSold = s.DONHANG.SoLuong;
      const productRevenue = s.DONHANG.TongTien;

      // Cập nhật doanh thu theo danh mục
      if (categoryMap[categoryName]) {
        categoryMap[categoryName] += productRevenue;
      } else {
        categoryMap[categoryName] = productRevenue;
      }

      // Cập nhật số lượng bán và doanh thu theo sản phẩm
      if (productMap[productName]) {
        productMap[productName].sold += productSold;
        productMap[productName].revenue += productRevenue;
      } else {
        productMap[productName] = {
          sold: productSold,
          revenue: productRevenue,
        };
      }
    }

    // Chuyển đổi categoryMap và productMap thành mảng và sắp xếp
    const categories: CategoryPerformance[] = Object.entries(categoryMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Lấy top 5 danh mục

    const products: ProductPerformance[] = Object.entries(productMap)
      .map(([name, { sold, revenue }]) => ({ name, sold, revenue }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5); // Lấy top

    categoryAndProductData.push({
      month: label,
      categories,
      products,
    });
    chartData.push({ month: label, revenue, capital });
    ordersData.push({ month: label, orders: numberOfOrders });
  }

  return { chartData, ordersData, categoryAndProductData };
}

function mapCustomersToCountPoints(
  customers?: { created_at: string }[]
): CountPoint[] {
  const now = new Date();
  const months: { key: string; label: string; year: number; month: number }[] =
    [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth() + 1}`,
      label: MONTHS[d.getMonth()],
      year: d.getFullYear(),
      month: d.getMonth() + 1,
    });
  }

  return months.map(({ label, year, month }) => {
    const count = (customers || []).filter((c) => {
      const d = new Date(c.created_at);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    }).length;
    return { month: label, customers: count };
  });
}

export default function StatsPage({
  fetchStats,
  fetchCustomers,
}: {
  fetchStats: ThongKeDoanhThuItem[];
  fetchCustomers: ThongKeSLKhachHangItem[];
}) {
  const { chartData, ordersData, categoryAndProductData } =
    mapThongKeToMonthlyPoints(fetchStats);
  console.log("categoryAndProductData:", categoryAndProductData);
  const countsData = mapCustomersToCountPoints(fetchCustomers);
  const mergedCountsData = countsData.map((item) => {
    const ordersItem = ordersData.find((o) => o.month === item.month);
    return {
      month: item.month,
      customers: item.customers,
      orders: ordersItem ? ordersItem.orders : 0,
    };
  });
  const thisMonthCustomers =
    mergedCountsData[mergedCountsData.length - 1]?.customers;
  const lastMonthCustomers =
    mergedCountsData[mergedCountsData.length - 2]?.customers;
  const thisMonthRevenue = chartData[chartData.length - 1]?.revenue;
  const lastMonthRevenue = chartData[chartData.length - 2]?.revenue;

  // const thisMonthCategories =
  //   categoryAndProductData[categoryAndProductData.length - 1]?.categories || [];
  // const lastMonthCategories =
  //   categoryAndProductData[categoryAndProductData.length - 2]?.categories || [];
  // const thisMonthProductsObj =
  //   categoryAndProductData[categoryAndProductData.length - 1]?.products || [];
  return (
    <div>
      <ToastContainer />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Phân tích chi tiết hiệu suất kinh doanh
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              toast.info("Chức năng đang ở chế độ testmode");
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <StatsGrid
          thisMonthRevenue={thisMonthRevenue ?? 0}
          lastMonthRevenue={lastMonthRevenue ?? 0}
          thisMonthCustomers={thisMonthCustomers ?? 0}
          lastMonthCustomers={lastMonthCustomers ?? 0}
        />
        {/* <PerformanceCardDisplay
          thisMonthCategories={thisMonthCategories}
          lastMonthCategories={lastMonthCategories ?? {}}
          thisMonthProducts={thisMonthProductsObj ?? {}}
        /> */}
        <div className="mt-6 border-t border-transparent pt-6">
          <StatsChart chartData={chartData} countData={mergedCountsData} />
        </div>
      </div>
    </div>
  );
}
