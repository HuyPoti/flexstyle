// ...existing code...

"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import type { Order } from "@/lib/types";

interface OrderState {
  order: Order | null;
}
type OrderAction =
  | { type: "SET_ORDER"; payload: Order }
  | { type: "CLEAR_ORDER" };

interface OrderContextType extends OrderState {
  setOrder: (order: Order) => void;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case "SET_ORDER": {
      localStorage.setItem("order", JSON.stringify(action.payload));
      return { order: action.payload };
    }
    case "CLEAR_ORDER": {
      localStorage.removeItem("order");
      return { order: null };
    }

    default:
      return state;
  }
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, { order: null });

  const setOrder = (order: Order) => {
    dispatch({ type: "SET_ORDER", payload: order });
  };
  const clearOrder = () => {
    dispatch({ type: "CLEAR_ORDER" });
  };

  return (
    <OrderContext.Provider value={{ ...state, setOrder, clearOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
