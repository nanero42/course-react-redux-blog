import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

interface Post {
  id?: string;
  title?: string;
  content?: string;
}

interface PostsState {
  posts?: Post[];
}

export interface State {
  posts: PostsState,
}

const initialState: PostsState = {
  posts: [
    {
      id: 'asdwf234t34g3',
      title: 'React',
      content: 'Learn React'
    }
  ],
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.posts?.push(action.payload);
      },
      prepare: (title: string, content: string) => {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
          }
        }
      }
    }
  }
});

export const getPosts = (state: State) => state.posts.posts;

export const {
  addPost,
} = postsSlice.actions;

export const { reducer: postsReducer } = postsSlice;