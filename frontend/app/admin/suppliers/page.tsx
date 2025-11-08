import { getAccessToken } from "@/lib/userInfo";
import AdminSuppliersPage from "./SuppliersPage";
async function getNccs() {
  const token = await getAccessToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ncc`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch NCCs");
  }
  return res.json();
}
export default async function Page() {
  const nccs = await getNccs();
  console.log(nccs.data);
  return <AdminSuppliersPage nccs={nccs.data} />;
}
