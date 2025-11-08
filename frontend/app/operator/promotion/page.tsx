import { SuKienUuDai, ThongBao } from "@/lib/types";
import PromotionPage from "./PromotionPage";
import { getUserId, getAccessToken } from "@/lib/userInfo";

async function fetchPromotions(accessToken: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sukienuudai/all`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch promotions");
  return await res.json();
}

async function fetchNotification(accessToken: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thongbao/sukienuudai`, {
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
  let promotions : SuKienUuDai[] = [];
  let notification: ThongBao[] = [];
  if (userId) {
    const accessToken = await getAccessToken();
    const response = await fetchPromotions(String(accessToken));
    const responseNotification = await fetchNotification(String(accessToken));
    promotions = response.data ?? [];
    // console.log("promotions", promotions);
    notification = responseNotification.data ?? [];
  }
  return (
    <div>
      <PromotionPage promotions={promotions ?? []} notification={notification ?? []} />
    </div>
  );
}
