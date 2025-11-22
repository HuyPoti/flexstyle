import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

// Định nghĩa kiểu dữ liệu trả về từ hàm findAllOrdersForCustomer
export interface EmailMarketing {
  email: string;
  created_at: Timestamp;
  type: string;
  VAITRO: string | null;
  Username: string | null;
}
export interface OrderResponse {
  MaDH: string;
  SoLuong: number;
  TongTien: number;
  TenNM: string;
  SoDienThoai: string;
  DiaChi: string;
  MaCTSP: string;
  MaTK_KH?: string;
  MaVoucher?: string;
  MaSK?: string;
  created_at: string;
  // Chi tiết sản phẩm
  CHITIETSANPHAM: {
    MaCTSP: string;
    KichCo: string;
    MaSP: string;
    SoLuong: number;
    TrangThaiSP: string;
    SANPHAM: {
      MaSP: string;
      TenSP: string;
      MoTa: string | null;
      HinhAnh: string[];
      GiaBan: number;
      GiaMua: number;
      TrangThai: string;
      MaDM: string;
      MauSac: string;
      slug: string;
    };
  };
  // Tình trạng đơn hàng (chỉ lấy bản ghi mới nhất)
  TINHTRANGDONHANG: Array<{
    MaTTDH: string;
    created_at: string;
    TrangThai: string;
    MaDH: string;
  }>;
}
export interface Product {
  MaSP: number;
  TenSP: string;
  MoTa: string | null;
  HinhAnh: string[];
  GiaBan: number;
  GiaMua: number;
  TrangThai: string;
  MaDM: string;
  MauSac: string;
  CHITIETSANPHAM: ChitietSanPham[];
  slug: string;
}

export interface Category {
  MaDM: string;
  TenDM: string;
  TrangThai: string;
  Loai: string;
}

export interface ChitietSanPham {
  MaCTSP: string;
  KichCo: string;
  MaSP: string;
  SoLuong: number;
  TrangThaiSP: string;
  SANPHAM: {
    MaSP: string;
    created_at: string;
    updated_at: string;
    MoTa: string;
    TenSP: string;
    HinhAnh: string[];
    GiaBan: number;
    GiaMua: number;
    TrangThai: string;
    MaDM: string;
    MauSac: string;
  };
}

export interface PhanHoi {
  MaPH: string;
  created_at: string;
  updated_at: string;
  MaTKKH: string;
  MaSP: string;
  SoSao: number;
  BinhLuan: string;
  Username?: string;
}

export interface PhanHoiForNV {
  MaPH: string;
  created_at: string;
  updated_at: string;
  MaTKKH: string;
  MaSP: string;
  SoSao: number;
  BinhLuan: string;
  Username?: string;
  SANPHAM: {
    TenSP: string;
  };
  TAIKHOAN?: {
    Username: string;
  };
}

export interface CartItem {
  // id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface SuKienUuDai {
  MaSK: string;
  TenSK: string;
  MoTa: string;
  NgayPH: Date;
  NgayKT: Date;
  PhanTramGiam: number;
  TrangThai: string;
}
export interface Voucher {
  MaVoucher: string;
  created_at: string;
  TenVoucher: string;
  SoTien: number;
  Loai: string;
  Code: string;
  NgayBatDau: Date;
  NgayKetThuc: Date;
  Dieukien: number;
  TrangThai: string;
  MoTa: string;
  SoLuong: number;
}

export interface Voucher_KhachHang {
  MaVCKH: string;
  MaTKKH: string;
  MaVoucher: string;
  TrangThai: string;
  created_at: Date;
  updated_at: Date;
  Hsd: Date;
  voucherDetails?: Voucher;
}

export interface ThongBao {
  MaTB: string;
  Loai: string;
  MaSK: string | null;
  MaVoucher: string | null;
}

export type UserRole = "KH" | "ADMIN" | "NCC" | "QLDN" | "NVVH" | "NVCSKH";

export type UserStatus = "ACTIVE" | "INACTIVE";

export type VaiTro = "KH" | "NCC" | "QLDN" | "NVVH" | "NVCSKH" | "ADMIN";
export type TrangThai = "ACTIVE" | "INACTIVE";

export interface NhanVien {
  MaTK: string;
  DisplayName: string;
  Email: string | null;
  Avatar: string | null;
  VAITRO: VaiTro;
  Status: TrangThai;
  created_at: Date;
  updated_at: Date;
}

export interface Supplier {
  MaTK: string;
  DisplayName: string;
  Email: string | null;
  Avatar: string | null;
  VAITRO: VaiTro;
  Status: TrangThai;
  created_at: Date;
  updated_at: Date;
}

export type Permission =
  // Product management
  | "products.view"
  | "products.create"
  | "products.edit"
  | "products.delete"
  // Order management
  | "orders.view"
  | "orders.edit"
  | "orders.cancel"
  | "orders.process"
  // User management
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  // Inventory management
  | "inventory.view"
  | "inventory.edit"
  | "inventory.reports"
  // Analytics
  | "analytics.view"
  | "analytics.export"
  // Customer support
  | "support.view"
  | "support.respond"
  // Promotions
  | "promotions.view"
  | "promotions.create"
  | "promotions.edit"
  // Suppliers
  | "suppliers.view"
  | "suppliers.manage";

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
    role?: UserRole;
    // permissions?: Permission[];
    // department?: string;
  };
  // created_at?: string;
  last_sign_in_at?: string;
  // MaTK?: string;
}

export interface Order {
  MaDH: string;
  MaTK_KH: string;
  DiaChi: string;
  SoDienThoai: string;
  TenNM: string;
  SoLuong: number;
  TongTien: number;
  MaVoucher?: string;
  MaSK?: string;
  MaCTSP: string;
}

export interface Role {
  id: UserRole;
  name: string;
  description: string;
  permissions: Permission[];
  color: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId?: string;
}

export interface Staff extends User {
  employeeId: string;
  department: string;
  manager?: string;
  salary?: number;
  startDate: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  sku: string;
  quantity: number;
  reservedQuantity: number;
  minStock: number;
  maxStock: number;
  location: string;
  lastUpdated: string;
  supplierId: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  type: "percentage" | "fixed" | "shipping";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdBy: string;
}

export interface CustomerSupport {
  id: string;
  customerId: string;
  staffId?: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "order" | "product" | "shipping" | "payment" | "other";
  createdAt: string;
  updatedAt: string;
  responses: SupportResponse[];
}

export interface SupportResponse {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
  attachments?: string[];
}

export interface ImagePart {
  data: string;
  mimeType: string;
}

export type UploadedImage = {
  data: string;
  mimeType: string;
} | null;

export interface KhachHangUser {
  MaTK: string;
  DisplayName: string | null;
  Username: string | null;
  Email: string | null;
  Avatar: string | null;
  VAITRO: VaiTro;
  Status: TrangThai;
  created_at: Date;
  updated_at: Date;
}

export interface ThongKeDoanhThuItem {
  DONHANG: {
    MaDH: string;
    TongTien: number;
    SoLuong: number;
    created_at: string;
    VOUCHER: {
      Loai: string;
      SoTien: number;
    };
    SUKIENUUDAI: {
      PhanTramGiam: number;
    };
    CHITIETSANPHAM: {
      SANPHAM: {
        GiaMua: number;
        GiaBan: number;
        TenSP: string;
        DANHMUC: {
          TenDM: string;
        };
      };
    };
  };
}

export interface ThongKeSLKhachHangItem {
  MaTK: string;
  created_at: string;
}

export interface ChiTietNhapHang {
  MaCTNH: string;
  SoLuong: number;
  DonGia: number;
  MaPNH: string;
  MaCTSP: string;
  created_at: Date;
}

export interface PhieuNhapHang {
  MaPNH: string;
  MaNCC: string;
  MaNV: string;
  MaTKNVQL: string;
  created_at: Date;
  TrangThai: string;
  MaTKNVXN: string;
  NoiDung: string;
}
