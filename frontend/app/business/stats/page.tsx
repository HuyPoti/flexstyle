import { getAccessToken } from "@/lib/userInfo";
import StatsPage from "./StatsPage";
async function handleFetchStats(accessToken: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thongke/doanhthu`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("fetch stats response:", res);
  if (!res.ok) {
    throw new Error("Failed to fetch stats");
  }
  const data = await res.json();
  return data;
}
async function handleFetchCustomer(accessToken: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thongke/khachhang`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log("fetch stats response:", res);
  if (!res.ok) {
    throw new Error("Failed to fetch stats");
  }
  const data = await res.json();
  return data;
}
export default async function StatsRootPage() {
  const accessToken = await getAccessToken();
  const stats = await handleFetchStats(String(accessToken));
  const customers = await handleFetchCustomer(String(accessToken));
  return (
    <StatsPage fetchStats={stats.data} fetchCustomers={customers.data}/>
  );
}
