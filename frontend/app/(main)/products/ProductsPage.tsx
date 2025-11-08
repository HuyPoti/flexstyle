"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductCard } from "@/components/product-card";
import type { Category, Product } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
export default function ProductsPage({
  initialProducts,
  categories,
  searchQuery: initialQuery,
}: {
  initialProducts: Product[];
  categories: Category[];
  searchQuery: string;
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [hasMore, setHasMore] = useState(true);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      const normalizedQuery = removeVietnameseTones(searchQuery.toLowerCase());
      filtered = filtered.filter((product) => {
        const name = removeVietnameseTones(product.TenSP.toLowerCase());
        const desc = removeVietnameseTones((product?.MoTa ?? "").toLowerCase());
        return name.includes(normalizedQuery) || desc.includes(normalizedQuery);
      });
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.MaDM)
      );
    }

    // Filter by price range
    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-500k":
          filtered = filtered.filter((product) => product.GiaBan < 500000);
          break;
        case "500k-1m":
          filtered = filtered.filter(
            (product) => product.GiaBan >= 500000 && product.GiaBan < 1000000
          );
          break;
        case "over-1m":
          filtered = filtered.filter((product) => product.GiaBan >= 1000000);
          break;
      }
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.GiaBan - b.GiaBan);
        break;
      case "price-high":
        filtered.sort((a, b) => b.GiaBan - a.GiaBan);
        break;
      //   case "rating":
      //     filtered.sort((a, b) => b.rating - a.rating);
      //     break;
      case "newest":
      default:
        // Keep original order for newest
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategories, priceRange, sortBy, products]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
    setHasMore(true);
  };
  const addMore = async () => {
    const currentLength =
      products.filter((product) => {
        return selectedCategories.includes(product.MaDM);
      }).length || products.length;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham?skip=${currentLength}&take=10&includeSizes=true&includeTenDM=${categories
        .filter((cat) => selectedCategories.includes(cat.MaDM))
        .map((cat) => cat.TenDM)
        .join(",")}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    const newProducts = data.data || [];
    setProducts((prev) => [...prev, ...newProducts]);
    if (newProducts.length < 10) setHasMore(false);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Khoảng giá</h3>
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn khoảng giá" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="under-500k">Dưới 500.000đ</SelectItem>
            <SelectItem value="500k-1m">500.000đ - 1.000.000đ</SelectItem>
            <SelectItem value="over-1m">Trên 1.000.000đ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Danh mục</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.MaDM} className="flex items-center space-x-2">
              <Checkbox
                id={category.MaDM}
                checked={selectedCategories.includes(category.MaDM)}
                onCheckedChange={(checked) =>
                  handleCategoryChange(category.MaDM, checked as boolean)
                }
              />
              <Label htmlFor={category.MaDM} className="text-sm">
                {category.TenDM}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tất cả sản phẩm</h1>
        <p className="text-muted-foreground">
          Khám phá bộ sưu tập thời trang đa dạng với {products.length} sản phẩm
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-card p-6 rounded-lg border">
            <h2 className="font-semibold mb-4 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </h2>
            <FilterContent />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden bg-transparent">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Bộ lọc
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
                  <SheetDescription>
                    Lọc sản phẩm theo danh mục và khoảng giá
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Hiển thị {filteredProducts.length} sản phẩm
              {searchQuery && ` cho "${searchQuery}"`}
            </p>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.MaSP + uuidv4()} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Không tìm thấy sản phẩm nào</p>
                <p className="text-sm">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategories([]);
                  setPriceRange("all");
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
          {hasMore ? (
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={addMore}>
                Xem thêm
              </Button>
            </div>
          ) : (
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Không còn sản phẩm nào để hiển thị
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
