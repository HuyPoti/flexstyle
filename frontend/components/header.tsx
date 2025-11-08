"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  Globe,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount } = useCart();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { setLanguage, t } = useLanguage();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const handleLogout = async () => {
    // const userId = user?.id;
    // const itemCart = localStorage.getItem("cart");
    // if (userId && itemCart) {
    //   const parsedCart = JSON.parse(itemCart);
    //   const mapperItem = parsedCart.map((item: any) => ({
    //     MaCTSP: item.productId,
    //     SoLuong: item.quantity,
    //     KichCo: item.size,
    //   }));
    //   // 2. Gọi API lưu giỏ hàng
    //   await fetch(
    //     `http://localhost:8080/api/giohang/update-cart?MaTKKH=${userId}`,
    //     {
    //       method: "PUT",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(mapperItem),
    //       keepalive: true,
    //     }
    //   );
    // }
    // localStorage.setItem("cart", JSON.stringify([]));
    await logout();
    router.push("/auth/login");
  };

  const checkEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchQuery.trim() !== "") {
      router.push(`/products?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src={"/logo.png"} alt="Logo" width={80} height={100} />
            <span className="text-2xl font-bold hidden md:block">
              FlexStyle
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/products/ao"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("nav.ao")}
            </Link>
            <Link
              href="/products/quan"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("nav.quan")}
            </Link>
            <Link
              href="/products/phu-kien"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("nav.phu-kien")}
            </Link>
            <Link
              href="/sale"
              className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
            >
              {t("nav.sale")}
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder={t("common.search")}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={checkEnter}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={() => setLanguage("vi")}>
                  🇻🇳 Tiếng Việt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/voucher">
                <Gift className="h-5 w-5" />
              </Link>
            </Button>
            {hydrated ? (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`relative h-8 w-8 rounded-full ${
                        user.user_metadata?.avatar_url
                          ? "p-0"
                          : "bg-red-500 text-white font-semibold"
                      }`}
                    >
                      {user.user_metadata?.avatar_url ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              user?.user_metadata?.avatar_url ||
                              "/placeholder.svg"
                            }
                            alt={user.email}
                          />
                          {/* <AvatarFallback>{user.name.charAt(0)}</AvatarFallback> */}
                          <AvatarFallback className="bg-red text-white font-semibold">
                            {user.email?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-base font-semibold text-white">
                          {user.email?.toUpperCase().charAt(0)}
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-white"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account">{t("nav.account")}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">Đơn hàng</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex"
                  asChild
                >
                  <Link href="/auth/login">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
              )
            ) : (
              <div style={{ width: 32, height: 32 }} />
            )}

            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder={t("common.search")}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/products/men"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  {t("nav.ao")}
                </Link>
                <Link
                  href="/products/women"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  {t("nav.quan")}
                </Link>
                <Link
                  href="/products/accessories"
                  className="text-sm font-medium hover:text-primary transition-colors py-2"
                >
                  {t("nav.phukien")}
                </Link>
                <Link
                  href="/sale"
                  className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors py-2"
                >
                  {t("nav.sale")}
                </Link>
                {user ? (
                  <>
                    <Link
                      href="/account"
                      className="text-sm font-medium hover:text-primary transition-colors py-2"
                    >
                      {t("nav.account")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium hover:text-primary transition-colors py-2 text-left"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="text-sm font-medium hover:text-primary transition-colors py-2"
                  >
                    {t("nav.login")}
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
