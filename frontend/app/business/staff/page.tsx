import { createClient } from "@/lib/supabase/server";
import StaffPageClient from "./StaffPageClient";
import StaffMember from "@/interfaces/staffMember";
export default async function StaffPage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await (await supabase).auth.getSession();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/nv`, {
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });
  const json = await res.json();
  const staffData: StaffMember[] = json.data;
  console.log("Staff Data:", staffData);
  return <StaffPageClient staffData={staffData} access_token={session?.access_token ?? ""} />;
}
