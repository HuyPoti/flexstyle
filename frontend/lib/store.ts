// frontend/lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./orderSlice";
export const store = configureStore({
  reducer: {
    order: orderReducer,
    // thêm các reducer khác nếu cần
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;