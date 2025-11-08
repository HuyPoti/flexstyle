import { getAccessToken, getUserId } from "@/lib/userInfo";
import AccountPage from "./AccountPage";
async function handleFetchTaiKhoan(userId: string, accessToken: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/taikhoan/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.ok) {
    const data = await res.json();

    return data;
  } else {
    throw new Error("Failed to fetch account data");
  }
}
export default async function AccountRootPage() {
  const user = await getUserId();
  const accessToken = await getAccessToken();
  const res = await handleFetchTaiKhoan(String(user), String(accessToken));
  console.log("Fetch account response:", res);
  return <AccountPage taiKhoan={res.data} accessToken={accessToken ?? ""} />;
}
