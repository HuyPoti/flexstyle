import { createClient } from "@/lib/supabase/server";
import CreateStockClient from "./CreateStockClient";
type NCCPublicInfo = {
  MaTK: string;
  DisplayName: string;
  Email: string;
  VAITRO: string;
};
type VariantInfo = {
  MaCTSP: string;
  MaSP: string;
  TenSP: string;
  KichCo: string;
  SoLuong: number;
  GiaMua: number;
};
export default async function Page() {
  const supabase = createClient();

  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  let suppliers: NCCPublicInfo[] = [];

  let variants: VariantInfo[] = [];

  try {
    const headers: Record<string, string> = {};
    if (session && session.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const [sRes, vRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ncc/public`, { headers }),
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chitietnhaphang/variants`, { headers }),
    ]);
    const sJson = await sRes.json();
    const vJson = await vRes.json();
    suppliers = sJson.data || sJson || [];
    variants = vJson.data || vJson || [];
  } catch (e) {
    console.error("Server fetch error", e);
  }

  return (
    <CreateStockClient
      supplierOptionsInitial={suppliers}
      variantOptionsInitial={variants}
    />
  );
}
