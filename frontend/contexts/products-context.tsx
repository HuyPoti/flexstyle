"use client";
import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
} from "react";

type Product = {
  MaSP: number;
  TenSP: string;
  MoTa: string | null;
  HinhAnh: string[];
  GiaBan: number;
  GiaMua: number;
  TrangThai: string;
  MaDM: string;
  MauSac: string;
};
type State = {
  products: Product[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Product[] }
  | { type: "FETCH_ERROR"; payload: string };

const initialState: State = {
  products: [],
  loading: false,
  error: null,
};

function productsReducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const ProductsContext = createContext<
  | {
      state: State;
      dispatch: Dispatch<Action>;
      fetchProducts: () => Promise<void>;
    }
  | undefined
>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, initialState);

  const fetchProducts = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      // Replace with your API endpoint
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data: Product[] = await res.json();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (error: any) {
      dispatch({
        type: "FETCH_ERROR",
        payload: error.message || "Unknown error",
      });
    }
  };

  return (
    <ProductsContext.Provider value={{ state, dispatch, fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context)
    throw new Error("useProducts must be used within ProductsProvider");
  return context;
};
