import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Post = {
  displayName: string;
  imagePath?: string;
  isLikedByCurrentUser: boolean;
  numberOfLikes: number;
  postId: number;
  textContent: string;
  timestamp: string;
  username: string;
  isRepost: boolean;
  isQuotePost: boolean;
  parentPostId?: number;
};

const initialState: Post[] = [];

export const postsSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (_, action: PayloadAction<Post[]>) => {
      return action.payload;
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const newPosts = state.map((o) => {
        if (o.postId === action.payload.postId) {
          return action.payload;
        }
        return o;
      });
      return newPosts;
    },
    appendPost: (state, action: PayloadAction<Post>) => {
      state.unshift({ ...action.payload, numberOfLikes: 0 });
      return state;
    },
  },
});

export const { setPosts, updatePost, appendPost } = postsSlice.actions;

export default postsSlice.reducer;
