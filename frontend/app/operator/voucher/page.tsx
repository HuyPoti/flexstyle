import { ThongBao, Voucher } from "@/lib/types";
import VoucherPage from "./VoucherPage";
import { getUserId, getAccessToken } from "@/lib/userInfo";

async function fetchVouchers(accessToken: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/voucher/all`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  // console.log("fetchVouchers - status:", res.status);
  return await res.json();
}

async function fetchNotification(accessToken: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thongbao/voucher`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.json();
  console.log("fetchnotification - status:", data);
  return data;
}

export default async function Page() {
  const userId = await getUserId();
  let vouchers: Voucher[] = [];
  let notification: ThongBao[] = [];
  if (userId) {
    const accessToken = await getAccessToken();
    const response = await fetchVouchers(String(accessToken));
    const responseNotification = await fetchNotification(String(accessToken));
    vouchers = response.data ?? [];
    notification = responseNotification.data ?? [];
    // console.log("vouchers", vouchers);
  }
  return (
    <div>
      <VoucherPage
        vouchers={vouchers ?? []}
        notifications={notification ?? []}
      />
    </div>
  );
}
