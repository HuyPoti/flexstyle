import { createClient } from "@/lib/supabase/server";
import UserClientPage from "./UserClientPage";

export default async function UserManagementPage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  // Fetch users from backend; endpoint requires QLDN role (checked on backend)
  const headers: Record<string, string> = {};
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/taikhoan`, { headers });
  const json = await res.json();
  const raw = json?.data ?? json ?? [];
  const taikhoanArray = Array.isArray(raw) ? raw : [];

  return <UserClientPage users={taikhoanArray} access_token={session?.access_token ?? ""} />;
}
