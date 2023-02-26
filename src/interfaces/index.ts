import { PostsSlice } from "src/features/posts/postsSlice";
import { UsersSlice } from "src/features/users/usersSlice";

export interface State {
  posts: PostsSlice,
  users: UsersSlice,
}

export interface Emoji {
  id: number;
  name: string;
  value: string;
  count: number;
}