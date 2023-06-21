import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

export const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setItem(state, action) {
      state.data = action.payload;
    },
    deleteItem(state) {
      state.data = null;
    },
  },
});

export const { setItem, deleteItem } = itemSlice.actions;
export default itemSlice.reducer;
