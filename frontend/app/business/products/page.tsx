// import Product from "@/interfaces/product";
import { createClient } from "@/lib/supabase/server";
import ProductsPageClient from "./ProductPage";

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/danhmuc`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}


export default async function ProductPage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await (await supabase).auth.getSession();
  const categories = await getCategories();
  // const res = await fetch(
  //   "http://localhost:8080/api/sanpham?includeSizes=true"
  // );
  // const json = await res.json();
  // let productData: Product[] = json.data;

  // const SIZE_ORDER = ["S", "M", "L", "XL", "XXL"];

  // productData = productData.map((product) => {
  //   if (product.CHITIETSANPHAM && Array.isArray(product.CHITIETSANPHAM)) {
  //     product.CHITIETSANPHAM = [...product.CHITIETSANPHAM].sort((a, b) => {
  //       const ia = SIZE_ORDER.indexOf(a.KichCo);
  //       const ib = SIZE_ORDER.indexOf(b.KichCo);
  //       if (ia === -1 && ib === -1) return a.KichCo.localeCompare(b.KichCo);
  //       if (ia === -1) return 1;
  //       if (ib === -1) return -1;
  //       return ia - ib;
  //     });
  //   }
  //   return product;
  // });

  return <ProductsPageClient access_token={session?.access_token ?? ""} categories={categories} />;
}
