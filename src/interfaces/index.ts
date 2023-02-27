import { PostsState } from "src/features/posts/postsSlice";
import { UsersSlice } from "src/features/users/usersSlice";

export interface State {
  posts: PostsState,
  users: UsersSlice,
}

export interface Emoji {
  id: number;
  name: string;
  value: string;
  count: number;
}