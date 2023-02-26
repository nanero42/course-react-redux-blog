import { combineReducers } from "@reduxjs/toolkit";
import { postsReducer } from "./posts/postsSlice";
import { usersReducer } from "./users/usersSlice";

export const rootReducer = combineReducers({
  posts: postsReducer,
  users: usersReducer,
});