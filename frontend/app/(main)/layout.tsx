import React from "react";
import { LanguageProvider } from "@/contexts/language-context";
import { cookies } from "next/headers";
import { CartProvider } from "@/contexts/cart-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";
import ChatWidget from "@/components/chat-widget";
import { SuKienUuDaiProvider } from "@/contexts/sukienuudai-context";
import ProtectedRoute from "@/components/protected-route";

import talkto from "@/components/talkto";

import type { SuKienUuDai, Voucher } from "@/lib/types";
import { OrderProvider } from "@/contexts/order-context";
import { ThongBaoProvider } from "@/contexts/thongbao-context";

async function fetchSukienuudais() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sukienuudai`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch sự kiện ưu đãi");
  }
  return res.json();
}

async function fetchThongBaoVC() {
  const setVouchers: Voucher[] = [];
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thongbao/voucher`, {
    cache: "no-store",
  });
  if (res.status !== 200 && res.status !== 201) {
    console.log("Failed to fetch voucher notifications", res);
    return [];
  } else {
    const { data } = await res.json();
    if (Array.isArray(data)) {
      for (const note of data) {
        const voucher = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/voucher/${note.MaVoucher}`
        );
        if (voucher.status === 200 || voucher.status === 201) {
          const { data } = await voucher.json();
          setVouchers.push(data);
        } else {
          console.log("Lỗi khi lấy thông tin voucher");
        }
      }
    } else {
      console.log("vouchers is not an array:", data);
    }
  }

  return setVouchers;
}

async function fetchThongBaoSK() {
  const setSukienuudai: SuKienUuDai[] = [];
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/thongbao/sukienuudai`, {
    cache: "no-store",
  });
  if (res.status !== 200 && res.status !== 201) {
    console.log("Failed to fetch sự kiện ưu đãi notifications");
    return [];
  } else {
    const { data } = await res.json();
    if (Array.isArray(data)) {
      for (const note of data) {
        const sukienuudai = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sukienuudai/${note.MaSK}`
        );
        if (sukienuudai.status === 200 || sukienuudai.status === 201) {
          const { data } = await sukienuudai.json();
          setSukienuudai.push(data);
        } else {
          console.log("Lỗi khi lấy thông tin sự kiện ưu đãi", sukienuudai);
        }
      }
    }
  }
  return setSukienuudai;
}

function compareDate(a: string | Date, b: string | Date): number {
  const da = typeof a === "string" ? new Date(a) : a;
  const db = typeof b === "string" ? new Date(b) : b;
  if (da < db) return -1;
  if (da > db) return 1;
  return 0;
}

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value || "vi";
  const sukienuudais = await fetchSukienuudais();
  const voucherPromotions = await fetchThongBaoVC();
  const sukienuudaiPromotions = await fetchThongBaoSK();

  return (
    <>
      <ProtectedRoute Role="KH" allowGuest={true}>
        <LanguageProvider initialLanguage={language as "en" | "vi"}>
          <CartProvider>
            <OrderProvider>
              <ThongBaoProvider
                initialSuKienUuDai={sukienuudaiPromotions}
                initialVouchers={voucherPromotions}
              >
                <SuKienUuDaiProvider
                  initialData={
                    sukienuudais.data.find(
                      (s: SuKienUuDai) =>
                        compareDate(s.NgayPH, new Date()) < 0 &&
                        compareDate(s.NgayKT, new Date()) > 0
                    ) ?? ({} as SuKienUuDai)
                  }
                >
                  <Header />
                  {children}
                  <Footer />
                  {process.env.NODE_ENV === "production" ? <Analytics /> : null}
                  <ChatWidget
                    config={{
                      chatUrl: process.env.N8N_CHAT_URL || "",
                      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
                      supabaseServiceRoleKey:
                        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || "",
                    }}
                  />
                  {talkto()}
                </SuKienUuDaiProvider>
              </ThongBaoProvider>
            </OrderProvider>
          </CartProvider>
        </LanguageProvider>
      </ProtectedRoute>
    </>
  );
}
