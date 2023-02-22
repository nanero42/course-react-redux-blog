import { combineReducers } from "@reduxjs/toolkit";
import { postsReducer } from "./posts/postsSlice";

export const rootReducer = combineReducers({
  posts: postsReducer,
});