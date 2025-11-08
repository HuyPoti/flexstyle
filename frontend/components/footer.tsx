import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src={"/logo.png"} alt="Logo" width={80} height={100} />
              <span className="text-xl font-bold">FlexStyle</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Cửa hàng thời trang hàng đầu Việt Nam, mang đến những sản phẩm
              chất lượng cao với giá cả hợp lý.
            </p>
            <div className="flex space-x-4">
              {/* <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              > */}
                <Facebook className="h-5 w-5" />
              {/* </Link> */}
              {/* <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              > */}
                <Instagram className="h-5 w-5" />
              {/* </Link> */}
              {/* <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              > */}
                <Twitter className="h-5 w-5" />
              {/* </Link> */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Đổi trả hàng
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Hỗ trợ khách hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Danh mục</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products/nao"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Thời trang áo
                </Link>
              </li>
              <li>
                <Link
                  href="/products/quan"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Thời trang quần
                </Link>
              </li>
              <li>
                <Link
                  href="/products/phu-kien"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Phụ kiện
                </Link>
              </li>
              <li>
                <Link
                  href="/sale"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Sản phẩm Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  An Dương Vương, Phường Chợ Quán, TP.HCM
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  0903 990 421
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  huynguyengiapoti@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 FlexStyle. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
