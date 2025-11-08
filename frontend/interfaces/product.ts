import Category from "./category";
import ProductDetail from "./productDetail";
export default interface Product {
  MaSP: string;
  TenSP: string;
  MoTa?: string;
  GiaBan: number;
  GiaMua?: number;
  MauSac: string;
  HinhAnh?: (string | File)[];
  TrangThai: string;
  slug: string;
  MaDM: string;
  CHITIETSANPHAM: ProductDetail[];
  DANHMUC: Category;
  created_at?: string;
  updated_at?: string;
}
