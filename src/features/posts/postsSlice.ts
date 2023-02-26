import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { emojies } from "src/consts";
import { Emoji, State } from "src/interfaces";

export interface Post {
  id: number;
  userId: string;
  title: string;
  content: string;
  date: string,
  reactions: Emoji[],
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export interface PostsSlice {
  items: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: any,
}

export type PatchPost = WithRequired<Post, 'id'>

export interface AddPost extends Post{}

export interface DeletePost {
  id: number;
}

const POSTS_URL = 'http://localhost:4000/posts';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  return (await axios.get(POSTS_URL)).data;
})

const initialState: PostsSlice = {
  items: [],
  status: 'idle',
  error: null,
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer: (state, action: PayloadAction<AddPost>) => {
        state.items.push(action.payload);
      },
      prepare: (userId: string, title: string, content: string) => {
        return {
          payload: {
            id: 1,
            userId,
            title,
            content,
            date: new Date().toISOString(),
            reactions: [...emojies],
          }
        }
      }
    },
    deletePost: {
      reducer: (state, action: PayloadAction<DeletePost>) => {
        state.items = state.items.filter((p) => p.id !== action.payload.id);
      },
      prepare: (id: number) => {
        return {
          payload: {
            id,
          }
        }
      }
    },
    patchPost: {
      reducer: (state, action: PayloadAction<PatchPost>) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id) || -1;
        if (index >= -1) {
          state.items.splice(index, 1, action.payload);
        }
      },
      prepare: (newObject: Post) => {
        return {
          payload: {
            ...newObject
          }
        }
      }
    },
    incrementReaction: (state, action) => {
      const { postId, reactionId } = action.payload;
      const post = state.items.find((item) => item.id === postId);
      const postIndex = state.items.findIndex((item) => item.id === postId);
      const reaction = post?.reactions.find((reaction) => reaction.id === reactionId);

      if (post && post.id >= 0 && reaction && reaction.id >= 0) {
        post.reactions[reactionId].count++;
        state.items.splice(postIndex, 1, post);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.concat(action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  }
});

export const getPosts = (state: State) => state.posts.items;
export const getPostsStatus = (state: State) => state.posts.status;
export const getPostsError = (state: State) => state.posts.error;

export const {
  addPost,
  deletePost,
  incrementReaction,
} = postsSlice.actions;

export const { reducer: postsReducer } = postsSlice;