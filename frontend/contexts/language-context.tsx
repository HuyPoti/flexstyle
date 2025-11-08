"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

type Language = "vi" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  vi: {
    // Navigation
    "nav.home": "Trang chủ",
    "nav.products": "Sản phẩm",
    "nav.ao": "Áo",
    "nav.quan": "Quần",
    "nav.phu-kien": "Phụ kiện",
    "nav.sale": "Khuyến mãi",
    "nav.about": "Giới thiệu",
    "nav.contact": "Liên hệ",
    "nav.cart": "Giỏ hàng",
    "nav.account": "Tài khoản",
    "nav.login": "Đăng nhập",
    "nav.register": "Đăng ký",
    //Auth
    "auth.subResetPassword": "Đã có tài khoản",
    "auth.login": "Đăng nhập",
    "auth.resetPassword": "Quên mật khẩu",
    // Common

    "common.search": "Tìm kiếm",
    "common.filter": "Lọc",
    "common.sort": "Sắp xếp",
    "common.price": "Giá",
    "common.size": "Kích thước",
    "common.color": "Màu sắc",
    "common.quantity": "Số lượng",
    "common.addToCart": "Thêm vào giỏ",
    "common.buyNow": "Mua ngay",
    "common.viewDetails": "Xem chi tiết",
    "common.loading": "Đang tải...",
    "common.error": "Có lỗi xảy ra",
    "common.success": "Thành công",

    // Footer
    "footer.company": "Công ty",
    "footer.support": "Hỗ trợ",
    "footer.policies": "Chính sách",
    "footer.shipping": "Giao hàng",
    "footer.returns": "Đổi trả",
    "footer.privacy": "Bảo mật",
    "footer.terms": "Điều khoản",
    "footer.newsletter": "Đăng ký nhận tin",
    "footer.subscribe": "Đăng ký",
    "footer.followUs": "Theo dõi chúng tôi",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.ao": "Shirts",
    "nav.quan": "Pants",
    "nav.phu-kien": "Accessories",
    "nav.sale": "Sale",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.cart": "Cart",
    "nav.account": "Account",
    "nav.login": "Login",
    "nav.register": "Register",
    //Auth
    "auth.subResetPassword": "Already have an account?",
    "auth.login": "Login",
    "auth.resetPassword": "Reset Password",
    // Common
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.price": "Price",
    "common.size": "Size",
    "common.color": "Color",
    "common.quantity": "Quantity",
    "common.addToCart": "Add to Cart",
    "common.buyNow": "Buy Now",
    "common.viewDetails": "View Details",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",

    // Footer
    "footer.company": "Company",
    "footer.support": "Support",
    "footer.policies": "Policies",
    "footer.shipping": "Shipping",
    "footer.returns": "Returns",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.newsletter": "Newsletter",
    "footer.subscribe": "Subscribe",
    "footer.followUs": "Follow Us",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
  initialLanguage = "vi",
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    const saved = document.cookie
      .split("; ")
      .find((row) => row.startsWith("language="))
      ?.split("=")[1] as Language;

    if (saved === "vi" || saved === "en") {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    document.cookie = `language=${lang}; path=/; max-age=31536000`;
  };

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
