"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import Category from "@/interfaces/category";

interface CategoryContextProps {
  categories: Category[];
  loading: boolean;
  refreshCategories: () => void;
}

export const CategoryContext = createContext<CategoryContextProps>({
  categories: [],
  loading: true,
  refreshCategories: () => {},
});

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/danhmuc`);
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{ categories, loading, refreshCategories: fetchCategories }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
