export interface Item {
  MaCTNH?: string
  MaPNH?: string
  MaCTSP?: string
  MaSP?: string
  TenSP?: string
  KichCo?: string
  SoLuong?: number
  DonGia?: number
}

export interface ReceiptData {
  MaPNH?: string
  created_at?: string | Date
  SoLuong?: number
  MaCTSP?: string
  MaNCC?: string
  TrangThai?: string
  MaTKNVQL?: string
  MaTKNVXN?: string | null
  NoiDung?: string
 
  items?: Item[]
}
