"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter as FilterIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductTable from "@/components/business/ProductTable";
import ProductPopup from "@/components/business/ProductPopup";
import ProductViewPopup from "@/components/business/ProductViewPopup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Product from "@/interfaces/product";
import axios from "axios";
import { Category } from "@/lib/types";

export default function ProductsPageClient({
  access_token,
  categories,
}: {
  access_token: string;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [noMoreProducts, setNoMoreProducts] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  enum Filter {
    All = "all",
    Active = "active",
    Inactive = "inactive",
  }
  const [filter, setFilter] = useState<Filter>(Filter.All);

  const categoryMap = {
    AO: "Áo",
    QUAN: "Quần",
    PHU_KIEN: "Phụ kiện",
  };

  const sizes = ["S", "M", "L", "XL", "XXL"];

  const sortProductSizes = (data: Product[]): Product[] => {
    return data.map((product) => {
      if (product.CHITIETSANPHAM && Array.isArray(product.CHITIETSANPHAM)) {
        product.CHITIETSANPHAM = [...product.CHITIETSANPHAM].sort((a, b) => {
          const ia = sizes.indexOf(a.KichCo);
          const ib = sizes.indexOf(b.KichCo);
          if (ia === -1 && ib === -1) return a.KichCo.localeCompare(b.KichCo);
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          return ia - ib;
        });
      }
      return product;
    });
  };

  const fetchProducts = async (pageNum: number) => {
    if (loading || noMoreProducts) return;
    setLoading(true);
    setError(null);

    try {
      const skip = (pageNum - 1) * pageSize;
      const take = pageSize;

      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham`, {
        params: { skip, take, includeSizes: true },
        headers: { Authorization: `Bearer ${access_token}` },
      });

      let fetchedData: Product[] = res.data.data ?? [];
      fetchedData = sortProductSizes(fetchedData);

      if (fetchedData.length === 0) {
        setNoMoreProducts(true);
        return;
      }

      // Merge and remove duplicates by MaSP
      setProducts((prev) => {
        const combined = [...prev, ...fetchedData];
        const uniqueProducts = Array.from(
          new Map(combined.map((p) => [p.MaSP, p])).values()
        );
        return uniqueProducts.sort((a, b) =>
          (b.created_at ?? "").localeCompare(a.created_at ?? "")
        );
      });
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // Infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !loading && !noMoreProducts) {
        setPage((prev) => prev + 1);
      }
    },
    [loading, noMoreProducts]
  );

  useEffect(() => {
    observer.current = new IntersectionObserver(handleObserver);
    if (loadMoreRef.current) observer.current.observe(loadMoreRef.current);

    return () => {
      if (observer.current && loadMoreRef.current)
        observer.current.unobserve(loadMoreRef.current);
    };
  }, [handleObserver]);

  // Filtering + search
  const filteredProducts = products
    .filter((p) => {
      if (filter === Filter.All) return true;
      if (filter === Filter.Active)
        return (p.TrangThai ?? "").toString() === "ACTIVE";
      if (filter === Filter.Inactive)
        return (p.TrangThai ?? "").toString() === "INACTIVE";
      return true;
    })
    .filter((p) =>
      [
        p.TenSP,
        p.MauSac,
        categoryMap[p.DANHMUC?.Loai as keyof typeof categoryMap],
      ].some((field) => field?.toLowerCase().includes(search.toLowerCase()))
    );

  const handleSave = async (data: Product) => {
    if (!data) return;
    setLoading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      for (const file of data.HinhAnh || []) {
        if (typeof file === "string") {
          uploadedUrls.push(file);
        } else {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "products");
          const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: formData }
          );
          const json = await res.json();
          uploadedUrls.push(json.secure_url);
        }
      }

      data.HinhAnh = uploadedUrls;

      const requestProduct = {
        TenSP: data.TenSP,
        GiaBan: data.GiaBan,
        MauSac: data.MauSac,
        TrangThai: data.TrangThai,
        MoTa: data.MoTa,
        HinhAnh: data.HinhAnh,
        MaDM: data.DANHMUC.MaDM,
        GiaMua: 0,
        slug:
          data.slug?.trim() ||
          data.TenSP.toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/^-+|-+$/g, ""),
      };

      const requestProductDetail = data.CHITIETSANPHAM.map((detail, i) => ({
        ...detail,
        KichCo: sizes[i],
      }));

      if (editing) {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham/${data.MaSP}`,
          requestProduct,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        for (const detail of requestProductDetail) {
          await axios.patch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chitietsanpham/${detail.MaCTSP}`,
            detail,
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );
        }
      } else {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham`,
          requestProduct,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        const newProductId = res.data.data.MaSP;
        for (const detail of requestProductDetail) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chitietsanpham`,
            { ...detail, MaSP: newProductId },
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );
        }
      }

      // Refresh first page without duplicates
      setProducts([]);
      setPage(1);
      setNoMoreProducts(false);
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Lưu sản phẩm thất bại");
    } finally {
      setLoading(false);
      setOpen(false);
      setEditing(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham/${id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setProducts([]);
      setPage(1);
      setNoMoreProducts(false);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Xóa sản phẩm thất bại");
    }
  };

  useEffect(() => {
    if (editing) setOpen(true);
  }, [editing]);

  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 w-full max-w-2xl mb-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo mã hoặc tên..."
              className="pl-10 bg-muted border-0 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
            disabled={loading}
          >
            Thêm sản phẩm
          </Button>
        </div>

        <Select
          onValueChange={(v) => setFilter(v as Filter)}
          defaultValue={Filter.All}
          disabled={loading}
        >
          <SelectTrigger className="w-48 relative pl-9 border-gray-200">
            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Filter.All}>Tất cả</SelectItem>
            <SelectItem value={Filter.Active}>Đang hoạt động</SelectItem>
            <SelectItem value={Filter.Inactive}>Ngừng hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <ProductTable
        products={filteredProducts}
        onEdit={(id) => setEditing(products.find((p) => p.MaSP === id) ?? null)}
        onDelete={handleDelete}
        onView={(id) =>
          setViewProduct(products.find((p) => p.MaSP === id) ?? null)
        }
      />

      <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
        {loading && <p>Đang tải...</p>}
        {noMoreProducts && !loading && (
          <p className="text-muted-foreground text-sm">
            Không còn sản phẩm nào nữa
          </p>
        )}
      </div>

      <ProductPopup
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        selectedSizeIndex={selectedSizeIndex}
        setSelectedSizeIndex={setSelectedSizeIndex}
        initialData={editing ?? undefined}
        error={error}
        setError={setError}
        categories={categories}
      />

      <ProductViewPopup
        open={Boolean(viewProduct)}
        productDetail={viewProduct?.CHITIETSANPHAM}
        onClose={() => setViewProduct(null)}
      />
    </main>
  );
}
