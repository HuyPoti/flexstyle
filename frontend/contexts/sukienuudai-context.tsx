"use client";
import { SuKienUuDai } from "@/lib/types";
import { createContext, useContext, useState } from "react";

interface SuKienUuDaiContextType {
  suKienUuDais: SuKienUuDai;
  setSuKienUuDais: React.Dispatch<React.SetStateAction<SuKienUuDai>>;
}

const SuKienUuDaiContext = createContext<SuKienUuDaiContextType | undefined>(
  undefined
);

export function SuKienUuDaiProvider({
  children,
  initialData = {} as SuKienUuDai,
}: {
  children: React.ReactNode;
  initialData?: SuKienUuDai;
}) {
  const [suKienUuDais, setSuKienUuDais] = useState<SuKienUuDai>(initialData);

  return (
    <SuKienUuDaiContext.Provider value={{ suKienUuDais, setSuKienUuDais }}>
      {children}
    </SuKienUuDaiContext.Provider>
  );
}

export function useSuKienUuDai() {
  const context = useContext(SuKienUuDaiContext);
  if (context === undefined) {
    throw new Error("useSuKienUuDai cần có SuKienUuDaiProvider");
  }
  return context;
}
