import ProductsPage from "./ProductsPage";

async function getProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham?skip=0&take=50&includeSizes=true`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/danhmuc`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export default async function ProductsCarousel({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const products = await getProducts();
  const categories = await getCategories();

  // Lấy giá trị searchQuery từ URL
  const initialQuery = searchParams?.query || "";

  return (
    <div>
      <ProductsPage
        key={products}
        initialProducts={products.data}
        categories={categories.data}
        searchQuery={initialQuery}
      />
    </div>
  );
}
