"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Product, Category } from "@/lib/types";
import { Gem } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
export default function PhuKienPage({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [sortBy, setSortBy] = useState<
    "featured" | "price-low" | "price-high" | "name"
  >("featured");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const addMore = async () => {
    const currentLength = products.filter((product) => {
      const category = categories.find((cat) => cat.MaDM === product.MaDM);
      return category?.Loai === "PHU_KIEN";
    }).length;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham?skip=${currentLength}&take=10&includeSizes=true&loaiDM=PHU_KIEN&includeTenDM=${
        categories.find((cat) => cat.MaDM === selectedCategory)?.TenDM || ""
      }`,
      { cache: "no-store" }
    );
    const data = await res.json();
    const newProducts = data.data || [];
    setProducts((prev) => [...prev, ...newProducts]);
  };
  // Filter all products
  const allPhuKienProducts = useMemo(() => {
    return products.filter((product) => {
      const category = categories.find((cat) => cat.MaDM === product.MaDM);
      return category?.Loai === "PHU_KIEN";
    });
  }, [products, categories]);
  const phuKienProducts = useMemo(() => {
    let filtered = allPhuKienProducts;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.MaDM === selectedCategory
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.GiaBan - b.GiaBan;
        case "price-high":
          return b.GiaBan - a.GiaBan;
        case "name":
          return a.TenSP.localeCompare(b.TenSP);
        default:
          return 0;
        // return b.rating - a.rating;
      }
    });
  }, [sortBy, selectedCategory, allPhuKienProducts]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-600 px-4 py-2 rounded-full mb-4">
          <Gem className="h-4 w-4" />
          <span className="font-medium">PHỤ KIỆN THỜI TRANG</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Hoàn Thiện <span className="text-amber-600">Phong Cách</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Bộ sưu tập phụ kiện cao cấp để tôn lên vẻ đẹp và cá tính riêng của bạn
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(
            (category) =>
              category.Loai === "PHU_KIEN" && (
                <Button
                  key={category.MaDM}
                  variant={
                    selectedCategory === category.MaDM ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.MaDM)}
                  className="flex items-center gap-2"
                >
                  {category.TenDM}
                </Button>
              )
          )}
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Phụ kiện thời trang</h2>
          <p className="text-muted-foreground">
            {phuKienProducts.length} sản phẩm được tìm thấy
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "featured" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("featured")}
          >
            Nổi bật
          </Button>
          <Button
            variant={sortBy === "price-low" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("price-low")}
          >
            Giá thấp
          </Button>
          <Button
            variant={sortBy === "price-high" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("price-high")}
          >
            Giá cao
          </Button>
          <Button
            variant={sortBy === "name" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("name")}
          >
            Tên A-Z
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {phuKienProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {phuKienProducts.map((product) => (
            <ProductCard key={uuidv4()} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">
            Không tìm thấy sản phẩm nào
          </h3>
          <p className="text-muted-foreground mb-6">
            Thử thay đổi bộ lọc hoặc tìm kiếm khác
          </p>
          <Button onClick={() => setSelectedCategory("all")}>
            Xem tất cả phụ kiện
          </Button>
        </div>
      )}
      <div className="mt-8 text-center">
        <Button variant="outline" onClick={addMore}>
          Xem thêm
        </Button>
      </div>
    </div>
  );
}
