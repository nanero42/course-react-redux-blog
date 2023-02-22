import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "src/features/rootReducer";

export const store = configureStore({
  reducer: rootReducer
})