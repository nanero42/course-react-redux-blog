import { PostsSlice } from "src/features/posts/postsSlice";
import { UsersState } from "src/features/users/usersSlice";

export interface State {
  posts: PostsSlice,
  users: UsersState,
}

export interface Emoji {
  id: number;
  name: string;
  value: string;
  count: number;
}