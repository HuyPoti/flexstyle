"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "id"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          ...action.payload,
          // id: `${action.payload.productId}-${action.payload.size}-${
          //   action.payload.color
          // }-${Date.now()}`,
        };
        newItems = [...state.items, newItem];
      }

      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      localStorage.setItem("cart", JSON.stringify(newItems));

      return { items: newItems, total, itemCount };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.productId !== action.payload
      );
      const total = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      localStorage.setItem("cart", JSON.stringify(newItems));
      return { items: newItems, total, itemCount };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item.productId === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      );

      // Remove items with 0 quantity
      const filteredItems = newItems.filter((item) => item.quantity > 0);
      const total = filteredItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = filteredItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      localStorage.setItem("cart", JSON.stringify(filteredItems));
      return { items: filteredItems, total, itemCount };
    }

    case "CLEAR_CART":
      localStorage.setItem("cart", JSON.stringify([]));
      return { items: [], total: 0, itemCount: 0 };

    case "LOAD_CART": {
      const total = action.payload.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const itemCount = action.payload.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      return { items: action.payload, total, itemCount };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: cartItems });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);
  const userIdRef = useRef<string | null>(null);

  const router = useRouter();
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const supabase = await createClient();
        const { data } = await supabase.auth.getSession();
        const userId = data?.session?.user?.id ?? null;
        if (isMounted) userIdRef.current = userId;
        // console.log("CartContext - userId:", userId);
      } catch (err) {
        console.error("Error initializing supabase client:", err);
      }
    }

    init();

    // Lắng nghe sự kiện chuyển trang (route change)
    async function handleRouteChange(url: string) {
      const userId = userIdRef.current;
      if (userId) {
        setIsLoading(true);
        const mapperItem = state.items.map((item) => ({
          MaCTSP: item.productId,
          SoLuong: item.quantity,
          KichCo: item.size,
        }));
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/giohang/update-cart?MaTKKH=${userId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mapperItem),
            keepalive: true,
          }
        );
      }
    }

    // Next.js App Router không có router.events, nên dùng window.addEventListener('Unload')
    const handleUnload = () => {
      if (document.visibilityState === "hidden") {
        handleRouteChange(window.location.pathname);
      }
    };
    window.addEventListener("unload", handleUnload);

    return () => {
      isMounted = false;
      window.removeEventListener("unload", handleUnload);
    };
  }, [state.items]);
  // Save cart to localStorage whenever it changes

  const addItem = (item: Omit<CartItem, "id">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };
  // useEffect(() => {
  //   // if (state.items.length === 0) return;
  //   // const local = localStorage.getItem("cart");
  //   // if (state.items.length != 0 && (local ? JSON.parse(local).length : 0)) {
  //     console.log("Saving cart to localStorage:", state.items);
  //     localStorage.setItem("cart", JSON.stringify(state.items));
  //   // }
  // }, [state.items]);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
