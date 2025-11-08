import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
// import { ThongKeDoanhThuItem, ThongKeSLKhachHangItem } from "@/lib/types";

// Dữ liệu doanh thu và vốn

// const defaultData: MonthlyPoint[] = [
//   { month: "Jan", revenue: 40000000, capital: 22000000 },
//   { month: "Feb", revenue: 25000000, capital: 15000000 },
//   { month: "Mar", revenue: 40000000, capital: 26000000 },
//   { month: "Apr", revenue: 50000000, capital: 31000000 },
//   { month: "May", revenue: 30000000, capital: 17000000 },
//   { month: "Jun", revenue: 34000000, capital: 19000000 },
//   { month: "Jul", revenue: 50000000, capital: 28000000 },
//   { month: "Aug", revenue: 52000000, capital: 28000000 },
//   { month: "Sep", revenue: 54000000, capital: 29000000 },
//   { month: "Oct", revenue: 56000000, capital: 31000000 },
//   { month: "Sep", revenue: 59000000, capital: 32000000 },
//   { month: "Nov", revenue: 63000000, capital: 33000000 },
//   { month: "Dec", revenue: 70000000, capital: 35000000 },
// ];

// Dữ liệu đếm đơn hàng và khách hàng

// const defaultCounts: CountPoint[] = [
//   { month: "Jan", orders: 120, customers: 80 },
//   { month: "Feb", orders: 98, customers: 70 },
//   { month: "Mar", orders: 140, customers: 100 },
//   { month: "Apr", orders: 160, customers: 110 },
//   { month: "May", orders: 110, customers: 85 },
//   { month: "Jun", orders: 130, customers: 95 },
//   { month: "Jul", orders: 165, customers: 120 },
//   { month: "Aug", orders: 165, customers: 120 },
//   { month: "Sep", orders: 165, customers: 120 },
//   { month: "Oct", orders: 165, customers: 160 },
//   { month: "Nov", orders: 165, customers: 180 },
//   { month: "Dec", orders: 165, customers: 200 },
// ];

// Hàm định dạng tiền tệ VND
function formatVND(n?: number | null) {
  if (n == null) return "0₫";
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

// Tùy chỉnh tooltip để hiển thị thông tin doanh thu
type TooltipProps = {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number }>;
  label?: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload) return null;
  const rev = payload.find((p: { dataKey: string; value: number }) => p.dataKey === "revenue")?.value;
  const cap = payload.find((p: { dataKey: string; value: number }) => p.dataKey === "capital")?.value;
  return (
    <div className="bg-white rounded shadow-md p-2 min-w-[160px] text-sm text-gray-900">
      <div className="font-semibold mb-1">{label}</div>
      <div className="text-gray-600">Doanh thu: {formatVND(rev ?? 0)}</div>
      <div className="text-gray-600">Vốn: {formatVND(cap ?? 0)}</div>
    </div>
  );
}

// Tùy chỉnh tooltip để hiển thị thông tin đơn hàng và khách hàng
function CountsTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload) return null;
  const ord = payload.find((p: { dataKey: string; value: number }) => p.dataKey === "orders")?.value;
  const cus = payload.find((p: { dataKey: string; value: number }) => p.dataKey === "customers")?.value;
  return (
    <div className="bg-white rounded shadow-md p-2 min-w-[160px] text-sm text-gray-900">
      <div className="font-semibold mb-1">{label}</div>
      <div className="text-gray-600">
        Đơn hàng: {typeof ord === "number" ? ord : 0}
      </div>
      <div className="text-gray-600">
        Khách hàng: {typeof cus === "number" ? cus : 0}
      </div>
    </div>
  );
}

type MonthlyPoint = {
  month: string;
  revenue?: number | null; // doanh thu
  capital?: number | null; // vốn
};
type CountPoint = {
  month: string;
  orders?: number | null; // đơn hàng
  customers?: number | null; // khách hàng
};
// Thành phần biểu đồ thống kê doanh thu, đơn hàng và khách hàng theo tháng
type Props = {
  chartData?: MonthlyPoint[];
  countData?: CountPoint[];
  height?: number;
};

export default function StatsChart({
  chartData,
  countData,
  height = 300,
}: Props) {
  // const { chartData, ordersData } = mapThongKeToMonthlyPoints(stats);
  // const countsData = mapCustomersToCountPoints(customers);
  // const mergedCountsData = countsData.map((item) => {
  //   const ordersItem = ordersData.find((o) => o.month === item.month);
  //   return {
  //     month: item.month,
  //     customers: item.customers,
  //     orders: ordersItem ? ordersItem.orders : 0,
  //   };
  // });
  // Nếu muốn dùng ordersData cho biểu đồ đơn hàng, có thể merge vào countsData tại đây
  return (
    <div>
      <div className="mt-6">
        <Card className="bg-transparent border border-slate-200">
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 56, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    width={80}
                    tickMargin={8}
                    tickFormatter={(v) =>
                      new Intl.NumberFormat("vi-VN").format(Number(v))
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" align="right" />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Doanh thu"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="capital"
                    name="Vốn"
                    stroke="#F97316"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="bg-transparent border border-slate-200">
          <CardHeader>
            <CardTitle>Đơn hàng và khách hàng theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: "100%", height }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={countData}
                  margin={{ top: 10, right: 10, left: 56, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis width={80} tickMargin={8} />
                  <Tooltip content={<CountsTooltip />} />
                  <Legend verticalAlign="top" align="right" />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    name="Đơn hàng"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    name="Khách hàng"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// "use client";

// import React from "react";
// // import StatsGrid from '../../../components/business/StatsGrid'
// import PerformanceCardDisplay from "../../../components/business/PerformanceCardDisplay";
// import StatsChart from "../../../components/business/StatsChart";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Download } from "lucide-react";
// import { ThongKeDoanhThuItem } from "@/lib/types";
// import { toast, ToastContainer } from "react-toastify";
// import StatsGrid from "@/components/business/StatsGrid";

// export default function StatsPage({
//   fetchStats,
//   accessToken,
// }: {
//   fetchStats: ThongKeDoanhThuItem[];
//   accessToken: string;
// }) {
//   return (
//     <div>
//       <ToastContainer />
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-muted-foreground">
//             Phân tích chi tiết hiệu suất kinh doanh
//           </p>
//         </div>
//         <div className="flex items-center space-x-2">
//           <Select defaultValue="30days">
//             <SelectTrigger className="w-40">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="7days">7 ngày qua</SelectItem>
//               <SelectItem value="30days">30 ngày qua</SelectItem>
//               <SelectItem value="90days">90 ngày qua</SelectItem>
//               <SelectItem value="1year">1 năm qua</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button
//             onClick={() => {
//               toast.info("Chức năng đang ở chế độ testmode");
//             }}
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Xuất báo cáo
//           </Button>
//         </div>
//       </div>
//       <div className="p-6 space-y-6">
//         <StatsGrid />
//         <PerformanceCardDisplay />
//         <div className="mt-6 border-t border-transparent pt-6">
//           <StatsChart stats={fetchStats}/>
//         </div>
//       </div>
//     </div>
//   );
// }
