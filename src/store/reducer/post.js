import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost(state, action) {
      state.data = action.payload;
    },
    deletePost(state) {
      state.data = null;
    },
  },
});

export const { setPost, deletePost } = postSlice.actions;
export default postSlice.reducer;
