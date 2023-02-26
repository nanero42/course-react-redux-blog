import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
}

export type PatchPost = WithRequired<Post, 'id'>

export interface AddPost extends Post{}

export interface DeletePost {
  id: number;
}

const initialState: PostsSlice = {
  items: [
    {
      id: 0,
      userId: '1234t5yu',
      title: 'React',
      content: 'Learn React',
      date: new Date().toISOString(),
      reactions: [
        ...emojies,
      ]
    }
  ],
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
    }
  }
});

export const getPosts = (state: State) => state.posts.items;

export const {
  addPost,
  deletePost,
  incrementReaction,
} = postsSlice.actions;

export const { reducer: postsReducer } = postsSlice;