"use client";
import { SuKienUuDai, Voucher } from "@/lib/types";
import { createContext, useContext, useState } from "react";

interface ThongBaoContextType {
  suKienUuDaisPromotions: SuKienUuDai[];
  setSuKienUuDaisPromotions: React.Dispatch<React.SetStateAction<SuKienUuDai[]>>;
  vouchersPromotions: Voucher[];
  setVouchersPromotions: React.Dispatch<React.SetStateAction<Voucher[]>>;
}

const ThongBaoContext = createContext<ThongBaoContextType | undefined>(
  undefined
);

export function ThongBaoProvider({
  children,
  initialSuKienUuDai = [] as SuKienUuDai[],
  initialVouchers = [] as Voucher[],
}: {
  children: React.ReactNode;
  initialSuKienUuDai?: SuKienUuDai[];
  initialVouchers?: Voucher[];
}) {
  const [suKienUuDaisPromotions, setSuKienUuDaisPromotions] = useState<SuKienUuDai[]>(initialSuKienUuDai);
  const [vouchersPromotions, setVouchersPromotions] = useState<Voucher[]>(initialVouchers);

  return (
    <ThongBaoContext.Provider value={{ suKienUuDaisPromotions, setSuKienUuDaisPromotions, vouchersPromotions, setVouchersPromotions }}>
      {children}
    </ThongBaoContext.Provider>
  );
}

export function useThongBao() {
  const context = useContext(ThongBaoContext);
  if (context === undefined) {
    throw new Error("useThongBao cần có ThongBaoProvider");
  }
  return context;
}
