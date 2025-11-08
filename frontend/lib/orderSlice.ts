// frontend/lib/orderSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Order } from "@/lib/types";

interface OrderState {
  order: Order | null;
}

const initialState: OrderState = {
  order: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrder(state, action: PayloadAction<Order>) {
      state.order = action.payload;
    },
    clearOrder(state) {
      state.order = null;
    },
  },
});

export const { setOrder, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;